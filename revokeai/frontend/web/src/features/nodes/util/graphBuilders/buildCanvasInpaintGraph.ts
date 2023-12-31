import { logger } from 'app/logging/logger';
import { RootState } from 'app/store/store';
import { NonNullableGraph } from 'features/nodes/types/types';
import {
  CreateDenoiseMaskInvocation,
  ImageBlurInvocation,
  ImageDTO,
  ImageToLatentsInvocation,
  MaskEdgeInvocation,
  NoiseInvocation,
  RandomIntInvocation,
  RangeOfSizeInvocation,
} from 'services/api/types';
import { addControlNetToLinearGraph } from './addControlNetToLinearGraph';
import { addLoRAsToGraph } from './addLoRAsToGraph';
import { addNSFWCheckerToGraph } from './addNSFWCheckerToGraph';
import { addSeamlessToLinearGraph } from './addSeamlessToLinearGraph';
import { addVAEToGraph } from './addVAEToGraph';
import { addWatermarkerToGraph } from './addWatermarkerToGraph';
import {
  CANVAS_COHERENCE_DENOISE_LATENTS,
  CANVAS_COHERENCE_INPAINT_CREATE_MASK,
  CANVAS_COHERENCE_MASK_EDGE,
  CANVAS_COHERENCE_NOISE,
  CANVAS_COHERENCE_NOISE_INCREMENT,
  CANVAS_INPAINT_GRAPH,
  CANVAS_OUTPUT,
  CLIP_SKIP,
  DENOISE_LATENTS,
  INPAINT_CREATE_MASK,
  INPAINT_IMAGE,
  INPAINT_IMAGE_RESIZE_DOWN,
  INPAINT_IMAGE_RESIZE_UP,
  ITERATE,
  LATENTS_TO_IMAGE,
  MAIN_MODEL_LOADER,
  MASK_BLUR,
  MASK_RESIZE_DOWN,
  MASK_RESIZE_UP,
  NEGATIVE_CONDITIONING,
  NOISE,
  POSITIVE_CONDITIONING,
  RANDOM_INT,
  RANGE_OF_SIZE,
  SEAMLESS,
} from './constants';

/**
 * Builds the Canvas tab's Inpaint graph.
 */
export const buildCanvasInpaintGraph = (
  state: RootState,
  canvasInitImage: ImageDTO,
  canvasMaskImage: ImageDTO
): NonNullableGraph => {
  const log = logger('nodes');
  const {
    positivePrompt,
    negativePrompt,
    model,
    cfgScale: cfg_scale,
    scheduler,
    steps,
    img2imgStrength: strength,
    iterations,
    seed,
    shouldRandomizeSeed,
    vaePrecision,
    shouldUseNoiseSettings,
    shouldUseCpuNoise,
    maskBlur,
    maskBlurMethod,
    canvasCoherenceMode,
    canvasCoherenceSteps,
    canvasCoherenceStrength,
    clipSkip,
    seamlessXAxis,
    seamlessYAxis,
  } = state.generation;

  if (!model) {
    log.error('No Image found in state');
    throw new Error('No Image found in state');
  }

  // The bounding box determines width and height, not the width and height params
  const { width, height } = state.canvas.boundingBoxDimensions;

  // We may need to set the inpaint width and height to scale the image
  const {
    scaledBoundingBoxDimensions,
    boundingBoxScaleMethod,
    shouldAutoSave,
  } = state.canvas;

  const fp32 = vaePrecision === 'fp32';

  const isUsingScaledDimensions = ['auto', 'manual'].includes(
    boundingBoxScaleMethod
  );

  let modelLoaderNodeId = MAIN_MODEL_LOADER;

  const use_cpu = shouldUseNoiseSettings
    ? shouldUseCpuNoise
    : shouldUseCpuNoise;

  const graph: NonNullableGraph = {
    id: CANVAS_INPAINT_GRAPH,
    nodes: {
      [modelLoaderNodeId]: {
        type: 'main_model_loader',
        id: modelLoaderNodeId,
        is_intermediate: true,
        model,
      },
      [CLIP_SKIP]: {
        type: 'clip_skip',
        id: CLIP_SKIP,
        is_intermediate: true,
        skipped_layers: clipSkip,
      },
      [POSITIVE_CONDITIONING]: {
        type: 'compel',
        id: POSITIVE_CONDITIONING,
        is_intermediate: true,
        prompt: positivePrompt,
      },
      [NEGATIVE_CONDITIONING]: {
        type: 'compel',
        id: NEGATIVE_CONDITIONING,
        is_intermediate: true,
        prompt: negativePrompt,
      },
      [MASK_BLUR]: {
        type: 'img_blur',
        id: MASK_BLUR,
        is_intermediate: true,
        radius: maskBlur,
        blur_type: maskBlurMethod,
      },
      [INPAINT_IMAGE]: {
        type: 'i2l',
        id: INPAINT_IMAGE,
        is_intermediate: true,
        fp32,
      },
      [NOISE]: {
        type: 'noise',
        id: NOISE,
        use_cpu,
        is_intermediate: true,
      },
      [INPAINT_CREATE_MASK]: {
        type: 'create_denoise_mask',
        id: INPAINT_CREATE_MASK,
        is_intermediate: true,
        fp32,
      },
      [DENOISE_LATENTS]: {
        type: 'denoise_latents',
        id: DENOISE_LATENTS,
        is_intermediate: true,
        steps: steps,
        cfg_scale: cfg_scale,
        scheduler: scheduler,
        denoising_start: 1 - strength,
        denoising_end: 1,
      },
      [CANVAS_COHERENCE_NOISE]: {
        type: 'noise',
        id: NOISE,
        use_cpu,
        is_intermediate: true,
      },
      [CANVAS_COHERENCE_NOISE_INCREMENT]: {
        type: 'add',
        id: CANVAS_COHERENCE_NOISE_INCREMENT,
        b: 1,
        is_intermediate: true,
      },
      [CANVAS_COHERENCE_DENOISE_LATENTS]: {
        type: 'denoise_latents',
        id: CANVAS_COHERENCE_DENOISE_LATENTS,
        is_intermediate: true,
        steps: canvasCoherenceSteps,
        cfg_scale: cfg_scale,
        scheduler: scheduler,
        denoising_start: 1 - canvasCoherenceStrength,
        denoising_end: 1,
      },
      [LATENTS_TO_IMAGE]: {
        type: 'l2i',
        id: LATENTS_TO_IMAGE,
        is_intermediate: true,
        fp32,
      },
      [CANVAS_OUTPUT]: {
        type: 'color_correct',
        id: CANVAS_OUTPUT,
        is_intermediate: !shouldAutoSave,
        reference: canvasInitImage,
      },
      [RANGE_OF_SIZE]: {
        type: 'range_of_size',
        id: RANGE_OF_SIZE,
        is_intermediate: true,
        // seed - must be connected manually
        // start: 0,
        size: iterations,
        step: 1,
      },
      [ITERATE]: {
        type: 'iterate',
        id: ITERATE,
        is_intermediate: true,
      },
    },
    edges: [
      // Connect Model Loader to CLIP Skip and UNet
      {
        source: {
          node_id: modelLoaderNodeId,
          field: 'unet',
        },
        destination: {
          node_id: DENOISE_LATENTS,
          field: 'unet',
        },
      },
      {
        source: {
          node_id: modelLoaderNodeId,
          field: 'clip',
        },
        destination: {
          node_id: CLIP_SKIP,
          field: 'clip',
        },
      },
      // Connect CLIP Skip to Conditioning
      {
        source: {
          node_id: CLIP_SKIP,
          field: 'clip',
        },
        destination: {
          node_id: POSITIVE_CONDITIONING,
          field: 'clip',
        },
      },
      {
        source: {
          node_id: CLIP_SKIP,
          field: 'clip',
        },
        destination: {
          node_id: NEGATIVE_CONDITIONING,
          field: 'clip',
        },
      },
      // Connect Everything To Inpaint Node
      {
        source: {
          node_id: POSITIVE_CONDITIONING,
          field: 'conditioning',
        },
        destination: {
          node_id: DENOISE_LATENTS,
          field: 'positive_conditioning',
        },
      },
      {
        source: {
          node_id: NEGATIVE_CONDITIONING,
          field: 'conditioning',
        },
        destination: {
          node_id: DENOISE_LATENTS,
          field: 'negative_conditioning',
        },
      },
      {
        source: {
          node_id: NOISE,
          field: 'noise',
        },
        destination: {
          node_id: DENOISE_LATENTS,
          field: 'noise',
        },
      },
      {
        source: {
          node_id: INPAINT_IMAGE,
          field: 'latents',
        },
        destination: {
          node_id: DENOISE_LATENTS,
          field: 'latents',
        },
      },
      // Create Inpaint Mask
      {
        source: {
          node_id: MASK_BLUR,
          field: 'image',
        },
        destination: {
          node_id: INPAINT_CREATE_MASK,
          field: 'mask',
        },
      },
      {
        source: {
          node_id: INPAINT_CREATE_MASK,
          field: 'denoise_mask',
        },
        destination: {
          node_id: DENOISE_LATENTS,
          field: 'denoise_mask',
        },
      },
      // Iterate
      {
        source: {
          node_id: RANGE_OF_SIZE,
          field: 'collection',
        },
        destination: {
          node_id: ITERATE,
          field: 'collection',
        },
      },
      {
        source: {
          node_id: ITERATE,
          field: 'item',
        },
        destination: {
          node_id: NOISE,
          field: 'seed',
        },
      },
      // Canvas Refine
      {
        source: {
          node_id: ITERATE,
          field: 'item',
        },
        destination: {
          node_id: CANVAS_COHERENCE_NOISE_INCREMENT,
          field: 'a',
        },
      },
      {
        source: {
          node_id: CANVAS_COHERENCE_NOISE_INCREMENT,
          field: 'value',
        },
        destination: {
          node_id: CANVAS_COHERENCE_NOISE,
          field: 'seed',
        },
      },
      {
        source: {
          node_id: modelLoaderNodeId,
          field: 'unet',
        },
        destination: {
          node_id: CANVAS_COHERENCE_DENOISE_LATENTS,
          field: 'unet',
        },
      },
      {
        source: {
          node_id: POSITIVE_CONDITIONING,
          field: 'conditioning',
        },
        destination: {
          node_id: CANVAS_COHERENCE_DENOISE_LATENTS,
          field: 'positive_conditioning',
        },
      },
      {
        source: {
          node_id: NEGATIVE_CONDITIONING,
          field: 'conditioning',
        },
        destination: {
          node_id: CANVAS_COHERENCE_DENOISE_LATENTS,
          field: 'negative_conditioning',
        },
      },
      {
        source: {
          node_id: CANVAS_COHERENCE_NOISE,
          field: 'noise',
        },
        destination: {
          node_id: CANVAS_COHERENCE_DENOISE_LATENTS,
          field: 'noise',
        },
      },
      {
        source: {
          node_id: DENOISE_LATENTS,
          field: 'latents',
        },
        destination: {
          node_id: CANVAS_COHERENCE_DENOISE_LATENTS,
          field: 'latents',
        },
      },
      // Decode Inpainted Latents To Image
      {
        source: {
          node_id: CANVAS_COHERENCE_DENOISE_LATENTS,
          field: 'latents',
        },
        destination: {
          node_id: LATENTS_TO_IMAGE,
          field: 'latents',
        },
      },
    ],
  };

  // Handle Scale Before Processing
  if (isUsingScaledDimensions) {
    const scaledWidth: number = scaledBoundingBoxDimensions.width;
    const scaledHeight: number = scaledBoundingBoxDimensions.height;

    // Add Scaling Nodes
    graph.nodes[INPAINT_IMAGE_RESIZE_UP] = {
      type: 'img_resize',
      id: INPAINT_IMAGE_RESIZE_UP,
      is_intermediate: true,
      width: scaledWidth,
      height: scaledHeight,
      image: canvasInitImage,
    };
    graph.nodes[MASK_RESIZE_UP] = {
      type: 'img_resize',
      id: MASK_RESIZE_UP,
      is_intermediate: true,
      width: scaledWidth,
      height: scaledHeight,
      image: canvasMaskImage,
    };
    graph.nodes[INPAINT_IMAGE_RESIZE_DOWN] = {
      type: 'img_resize',
      id: INPAINT_IMAGE_RESIZE_DOWN,
      is_intermediate: true,
      width: width,
      height: height,
    };
    graph.nodes[MASK_RESIZE_DOWN] = {
      type: 'img_resize',
      id: MASK_RESIZE_DOWN,
      is_intermediate: true,
      width: width,
      height: height,
    };

    (graph.nodes[NOISE] as NoiseInvocation).width = scaledWidth;
    (graph.nodes[NOISE] as NoiseInvocation).height = scaledHeight;
    (graph.nodes[CANVAS_COHERENCE_NOISE] as NoiseInvocation).width =
      scaledWidth;
    (graph.nodes[CANVAS_COHERENCE_NOISE] as NoiseInvocation).height =
      scaledHeight;

    // Connect Nodes
    graph.edges.push(
      // Scale Inpaint Image and Mask
      {
        source: {
          node_id: INPAINT_IMAGE_RESIZE_UP,
          field: 'image',
        },
        destination: {
          node_id: INPAINT_IMAGE,
          field: 'image',
        },
      },
      {
        source: {
          node_id: MASK_RESIZE_UP,
          field: 'image',
        },
        destination: {
          node_id: MASK_BLUR,
          field: 'image',
        },
      },
      {
        source: {
          node_id: INPAINT_IMAGE_RESIZE_UP,
          field: 'image',
        },
        destination: {
          node_id: INPAINT_CREATE_MASK,
          field: 'image',
        },
      },
      // Color Correct The Inpainted Result
      {
        source: {
          node_id: LATENTS_TO_IMAGE,
          field: 'image',
        },
        destination: {
          node_id: INPAINT_IMAGE_RESIZE_DOWN,
          field: 'image',
        },
      },
      {
        source: {
          node_id: INPAINT_IMAGE_RESIZE_DOWN,
          field: 'image',
        },
        destination: {
          node_id: CANVAS_OUTPUT,
          field: 'image',
        },
      },
      {
        source: {
          node_id: MASK_BLUR,
          field: 'image',
        },
        destination: {
          node_id: MASK_RESIZE_DOWN,
          field: 'image',
        },
      },
      {
        source: {
          node_id: MASK_RESIZE_DOWN,
          field: 'image',
        },
        destination: {
          node_id: CANVAS_OUTPUT,
          field: 'mask',
        },
      }
    );
  } else {
    // Add Images To Nodes
    (graph.nodes[NOISE] as NoiseInvocation).width = width;
    (graph.nodes[NOISE] as NoiseInvocation).height = height;
    (graph.nodes[CANVAS_COHERENCE_NOISE] as NoiseInvocation).width = width;
    (graph.nodes[CANVAS_COHERENCE_NOISE] as NoiseInvocation).height = height;

    graph.nodes[INPAINT_IMAGE] = {
      ...(graph.nodes[INPAINT_IMAGE] as ImageToLatentsInvocation),
      image: canvasInitImage,
    };
    graph.nodes[MASK_BLUR] = {
      ...(graph.nodes[MASK_BLUR] as ImageBlurInvocation),
      image: canvasMaskImage,
    };
    graph.nodes[INPAINT_CREATE_MASK] = {
      ...(graph.nodes[INPAINT_CREATE_MASK] as CreateDenoiseMaskInvocation),
      image: canvasInitImage,
    };

    graph.edges.push(
      // Color Correct The Inpainted Result
      {
        source: {
          node_id: LATENTS_TO_IMAGE,
          field: 'image',
        },
        destination: {
          node_id: CANVAS_OUTPUT,
          field: 'image',
        },
      },
      {
        source: {
          node_id: MASK_BLUR,
          field: 'image',
        },
        destination: {
          node_id: CANVAS_OUTPUT,
          field: 'mask',
        },
      }
    );
  }

  // Handle Coherence Mode
  if (canvasCoherenceMode !== 'unmasked') {
    // Create Mask If Coherence Mode Is Not Full
    graph.nodes[CANVAS_COHERENCE_INPAINT_CREATE_MASK] = {
      type: 'create_denoise_mask',
      id: CANVAS_COHERENCE_INPAINT_CREATE_MASK,
      is_intermediate: true,
      fp32,
    };

    // Handle Image Input For Mask Creation
    if (isUsingScaledDimensions) {
      graph.edges.push({
        source: {
          node_id: INPAINT_IMAGE_RESIZE_UP,
          field: 'image',
        },
        destination: {
          node_id: CANVAS_COHERENCE_INPAINT_CREATE_MASK,
          field: 'image',
        },
      });
    } else {
      graph.nodes[CANVAS_COHERENCE_INPAINT_CREATE_MASK] = {
        ...(graph.nodes[
          CANVAS_COHERENCE_INPAINT_CREATE_MASK
        ] as CreateDenoiseMaskInvocation),
        image: canvasInitImage,
      };
    }

    // Create Mask If Coherence Mode Is Mask
    if (canvasCoherenceMode === 'mask') {
      if (isUsingScaledDimensions) {
        graph.edges.push({
          source: {
            node_id: MASK_RESIZE_UP,
            field: 'image',
          },
          destination: {
            node_id: CANVAS_COHERENCE_INPAINT_CREATE_MASK,
            field: 'mask',
          },
        });
      } else {
        graph.nodes[CANVAS_COHERENCE_INPAINT_CREATE_MASK] = {
          ...(graph.nodes[
            CANVAS_COHERENCE_INPAINT_CREATE_MASK
          ] as CreateDenoiseMaskInvocation),
          mask: canvasMaskImage,
        };
      }
    }

    // Create Mask Edge If Coherence Mode Is Edge
    if (canvasCoherenceMode === 'edge') {
      graph.nodes[CANVAS_COHERENCE_MASK_EDGE] = {
        type: 'mask_edge',
        id: CANVAS_COHERENCE_MASK_EDGE,
        is_intermediate: true,
        edge_blur: maskBlur,
        edge_size: maskBlur * 2,
        low_threshold: 100,
        high_threshold: 200,
      };

      // Handle Scaled Dimensions For Mask Edge
      if (isUsingScaledDimensions) {
        graph.edges.push({
          source: {
            node_id: MASK_RESIZE_UP,
            field: 'image',
          },
          destination: {
            node_id: CANVAS_COHERENCE_MASK_EDGE,
            field: 'image',
          },
        });
      } else {
        graph.nodes[CANVAS_COHERENCE_MASK_EDGE] = {
          ...(graph.nodes[CANVAS_COHERENCE_MASK_EDGE] as MaskEdgeInvocation),
          image: canvasMaskImage,
        };
      }

      graph.edges.push({
        source: {
          node_id: CANVAS_COHERENCE_MASK_EDGE,
          field: 'image',
        },
        destination: {
          node_id: CANVAS_COHERENCE_INPAINT_CREATE_MASK,
          field: 'mask',
        },
      });
    }

    // Plug Denoise Mask To Coherence Denoise Latents
    graph.edges.push({
      source: {
        node_id: CANVAS_COHERENCE_INPAINT_CREATE_MASK,
        field: 'denoise_mask',
      },
      destination: {
        node_id: CANVAS_COHERENCE_DENOISE_LATENTS,
        field: 'denoise_mask',
      },
    });
  }

  // Handle Seed
  if (shouldRandomizeSeed) {
    // Random int node to generate the starting seed
    const randomIntNode: RandomIntInvocation = {
      id: RANDOM_INT,
      type: 'rand_int',
    };

    graph.nodes[RANDOM_INT] = randomIntNode;

    // Connect random int to the start of the range of size so the range starts on the random first seed
    graph.edges.push({
      source: { node_id: RANDOM_INT, field: 'value' },
      destination: { node_id: RANGE_OF_SIZE, field: 'start' },
    });
  } else {
    // User specified seed, so set the start of the range of size to the seed
    (graph.nodes[RANGE_OF_SIZE] as RangeOfSizeInvocation).start = seed;
  }

  // Add Seamless To Graph
  if (seamlessXAxis || seamlessYAxis) {
    addSeamlessToLinearGraph(state, graph, modelLoaderNodeId);
    modelLoaderNodeId = SEAMLESS;
  }

  // Add VAE
  addVAEToGraph(state, graph, modelLoaderNodeId);

  // add LoRA support
  addLoRAsToGraph(state, graph, DENOISE_LATENTS, modelLoaderNodeId);

  // add controlnet, mutating `graph`
  addControlNetToLinearGraph(state, graph, DENOISE_LATENTS);

  // NSFW & watermark - must be last thing added to graph
  if (state.system.shouldUseNSFWChecker) {
    // must add before watermarker!
    addNSFWCheckerToGraph(state, graph, CANVAS_OUTPUT);
  }

  if (state.system.shouldUseWatermarker) {
    // must add after nsfw checker!
    addWatermarkerToGraph(state, graph, CANVAS_OUTPUT);
  }

  return graph;
};
