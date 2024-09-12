import Swal from "sweetalert2";

const Gallery = () => {
  const handleUpdated = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const image = form.get("image");

    const upload = {
      image,
    };
    console.log(upload, "hlw");
    fetch("http://localhost:5000/galleryI", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(upload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        if (data.insertedId) {
          Swal.fire({
            title: "Success!",
            text: "User Added Successfully",
            icon: "success",
            confirmButtonText: "Done",
          });
        }
      });
  };
  return (
    <div>
      <form onSubmit={handleUpdated}>
        <input
          type="file"
          className="file-input file-input-bordered my-12 w-full max-w-xs"
          name="image"
        />
        <input type="submit" value="Uploaded" />
      </form>
    </div>
  );
};

export default Gallery;
