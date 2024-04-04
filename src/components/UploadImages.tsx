import { z } from "zod";
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
import { api } from "~/utils/api";

const ACCEPTED_IMAGE_TYPES = ["image/png", "image/jpg", "image/jpeg"];
const MAX_IMAGE_SIZE = 10; //In MegaBytes

const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const result = sizeInBytes / (1024 * 1024);
  return +result.toFixed(decimalsNum);
};

const UserGeneralInfoSchema = z.object({
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

function UploadImages() {
  const form = useForm<z.infer<typeof UserGeneralInfoSchema>>({
    defaultValues: {
      images: [] as unknown as FileList,
    },
    resolver: zodResolver(UserGeneralInfoSchema),
  });

  const images = form.watch("images");
  return (
    <Form {...form}>
      <form className="space-y-8">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Images</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    console.log(e.target.files);
                    form.setValue(
                      "images",
                      e.target.files ?? ([] as unknown as FileList),
                    );
                  }}
                />
              </FormControl>
              <FormDescription>Upload images of your product</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          {images.length > 0 && (
            <div className="space-y-4">
              {Array.from(images).map((image, index) => (
                <div key={index}>
                  <img
                    src={URL.createObjectURL(image)}
                    alt="product"
                    className="h-32 w-32 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default UploadImages;
