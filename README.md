> 🗃 Optimize bmp, jpg, png, &amp; images in Node.js.

## Usage

```sh
# Default optimization. Default quality of image will set to 90%.
optimize-img --source="images/image.jpg"
```

```sh
# Set the quality of the image.
optimize-img --source="images/image.jpg" --quality 80
```

```sh
# Set output of the optimized image. Output is a relative path.
optimize-img --source="images/image.jpg" --quality 80 --output="dist"

# Output of above:
# dist/images/image.jpg
```

```sh
# Optimize batch of files.
optimize-img --source="images/*" --quality 80 --output="dist"
```

```sh
# Optimize nested images.
optimize-img --source="images/**" --quality 80 --output="dist"
```
