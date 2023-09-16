---
title: Textual Inversion Embeddings and LoRAs
---

# :material-library-shelves: Textual Inversions and LoRAs

With the advances in research, many new capabilities are available to customize the knowledge and understanding of novel concepts not originally contained in the base model. 


## Using Textual Inversion Files

Textual inversion (TI) files are small models that customize the output of
Stable Diffusion image generation. They can augment SD with specialized subjects
and artistic styles. They are also known as "embeds" in the machine learning
world.

Each TI file introduces one or more vocabulary terms to the SD model. These are
known in RevokeAI as "triggers." Triggers are denoted using angle brackets 
as in "&lt;trigger-phrase&gt;". The two most common type of
TI files that you'll encounter are `.pt` and `.bin` files, which are produced by
different TI training packages. RevokeAI supports both formats, but its
[built-in TI training system](TRAINING.md) produces `.pt`.

[Hugging Face](https://huggingface.co/sd-concepts-library) has
amassed a large library of &gt;800 community-contributed TI files covering a
broad range of subjects and styles. You can also install your own or others' TI files 
by placing them in the designated directory for the compatible model type

### An Example

Here are a few examples to illustrate how it works. All these images were
generated using the command-line client and the Stable Diffusion 1.5 model:

|         Japanese gardener          | Japanese gardener &lt;ghibli-face&gt; | Japanese gardener &lt;hoi4-leaders&gt; | Japanese gardener &lt;cartoona-animals&gt; |
| :--------------------------------: | :-----------------------------------: | :------------------------------------: | :----------------------------------------: |
| ![](../assets/concepts/image1.png) |  ![](../assets/concepts/image2.png)   |   ![](../assets/concepts/image3.png)   |     ![](../assets/concepts/image4.png)     |

You can also combine styles and concepts:

<figure markdown>
  | A portrait of &lt;alf&gt; in &lt;cartoona-animal&gt; style |
  | :--------------------------------------------------------: |
  | ![](../assets/concepts/image5.png)                         |
</figure>


## Installing your Own TI Files

You may install any number of `.pt` and `.bin` files simply by copying them into
the `embedding` directory of the corresponding RevokeAI models directory (usually `revokeai`
in your home directory). For example, you can simply move a Stable Diffusion 1.5 embedding file to
the `sd-1/embedding` folder. Be careful not to overwrite one file with another.
For example, TI files generated by the Hugging Face toolkit share the named
`learned_embedding.bin`. You can rename these, or use subdirectories to keep them distinct.

At startup time, RevokeAI will scan the various `embedding` directories and load any TI
files it finds there for compatible models. At startup you will see a message similar to this one:

```bash
>> Current embedding manager terms: <HOI4-Leader>, <princess-knight>
```
To use these when generating, simply type the `<` key in your prompt to open the Textual Inversion WebUI and 
select the embedding you'd like to use. This UI has type-ahead support, so you can easily find supported embeddings.

## Using LoRAs

LoRA files are models that customize the output of Stable Diffusion
image generation.  Larger than embeddings, but much smaller than full
models, they augment SD with improved understanding of subjects and
artistic styles.

Unlike TI files, LoRAs do not introduce novel vocabulary into the
model's known tokens. Instead, LoRAs augment the model's weights that
are applied to generate imagery. LoRAs may be supplied with a
"trigger" word that they have been explicitly trained on, or may
simply apply their effect without being triggered.

LoRAs are typically stored in .safetensors files, which are the most
secure way to store and transmit these types of weights. You may
install any number of `.safetensors` LoRA files simply by copying them
into the `autoimport/lora` directory of the corresponding RevokeAI models
directory (usually `revokeai` in your home directory).

To use these when generating, open the LoRA menu item in the options
panel, select the LoRAs you want to apply and ensure that they have
the appropriate weight recommended by the model provider. Typically,
most LoRAs perform best at a weight of .75-1.
