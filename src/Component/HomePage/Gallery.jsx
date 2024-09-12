import Swal from "sweetalert2";
import useAxiosPublic from "../useAxiosPublic";
import { useForm } from "react-hook-form";

const image_hosting_key = import.meta.env.VITE_IMGBB_API_KEY; // Correct env key
const image_hosting_api = `https://api.imgbb.com/1/upload?key=${image_hosting_key}`;

const Gallery = () => {
  const axiosPublic = useAxiosPublic();
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log(data);

      const imageFile = new FormData();
      imageFile.append("image", data.image[0]);

      const res = await axiosPublic.post(image_hosting_api, imageFile, {
        headers: {
          "content-type": "multipart/form-data",
        },
      });

      if (res.data && res.data.data && res.data.data.url) {
        const imageUrl = res.data.data.url;

        const upload = {
          imageUrl,
        };

        const backendResponse = await axiosPublic.post(
          "http://localhost:5000/galleryI",
          upload,
          {
            headers: {
              "content-type": "application/json",
            },
          }
        );

        if (backendResponse.data.insertedId) {
          Swal.fire({
            title: "Success!",
            text: "Image Uploaded Successfully",
            icon: "success",
            confirmButtonText: "Done",
          });
          reset();
        }
      } else {
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "There was an issue with the upload",
        icon: "error",
        confirmButtonText: "Retry",
      });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center">
          <div className="my-6">
            <input
              {...register("image", { required: true })}
              type="file"
              className="file-input file-input-bordered w-full max-w-xs"
            />
          </div>
          <input
            type="submit"
            value="Upload"
            className="btn btn-secondary ml-2"
          />
        </div>
      </form>
    </div>
  );
};

export default Gallery;
