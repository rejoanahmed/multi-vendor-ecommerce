import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { addProductSchema } from "~/utils/formSchema";
import { z } from "zod";
import { api } from "~/utils/api";
import { Textarea } from "~/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { uploadImage } from "~/utils/firestorage";

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_IMAGE_SIZE = 10; //In MegaBytes

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

const schema = addProductSchema.omit({ images: true }).extend({
  images: z
    .custom<FileList>()
    .refine((files) => {
      return Array.from(files ?? []).length !== 0;
    }, "Image is required")
    .refine((files) => {
      return Array.from(files ?? []).every(
        (file) => sizeInMB(file.size) <= MAX_IMAGE_SIZE,
      );
    }, `The maximum image size is ${MAX_IMAGE_SIZE}MB`)
    .refine((files) => {
      return Array.from(files ?? []).every((file) =>
        ACCEPTED_IMAGE_TYPES.includes(file.type),
      );
    }, "File type is not supported"),
});

function Addproduct() {
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      name: "",
      description: "",
      images: [] as unknown as FileList,
      price: 0,
    },
    resolver: zodResolver(schema),
  });

  const { mutate: CreateProduct } = api.products.create.useMutation();

  async function onSubmit(values: z.infer<typeof schema>) {
    console.log(values);
    for (const image of values.images) {
      const imageUrl = await uploadImage(image);
      console.log(imageUrl);
    }
  }

  const images = form.watch("images");

  return (
    <Sheet>
      <SheetTrigger>
        <Button>Add Product</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle className="text-center">Add Product</SheetTitle>
          <SheetDescription>
            Add a product to your store to start selling.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="images"
              render={({ field }) => (
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {images.length > 0 &&
                    Array.from(images).map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt="product"
                          className="h-32 w-32 rounded-lg border object-cover
                          "
                        />
                        <div className="absolute right-0 top-0 rounded bg-slate-500 bg-opacity-50 p-1">
                          <button
                            className="bg-transparent"
                            onClick={() => {
                              form.setValue(
                                "images",
                                Array.from(images).filter(
                                  (_, i) => i !== index,
                                ) as unknown as FileList,
                              );
                            }}
                          >
                            <X />
                          </button>
                        </div>
                      </div>
                    ))}
                  <FormControl>
                    <div className="relative flex h-40 w-full items-center  justify-center rounded-lg border shadow">
                      <Upload size={32} />
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        className="absolute inset-0 bottom-0 top-0 h-full w-full flex-grow cursor-pointer border opacity-0"
                        onChange={(e) => {
                          form.setValue(
                            "images",
                            Array.from(images).concat(
                              Array.from(e.target.files ?? []),
                            ) as unknown as FileList,
                          );
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormLabel className="w-full text-center">
                    Add Images
                  </FormLabel>
                  <FormMessage />
                </div>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Iphone 14 pr max" {...field} />
                  </FormControl>
                  <FormDescription>
                    Name of the product you are selling
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="An awesome product " {...field} />
                  </FormControl>
                  <FormDescription>
                    Describe your product in 200 characters or less
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

export default Addproduct;
