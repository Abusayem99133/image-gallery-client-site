import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import "../../Component/gallery.css";

const Images = () => {
  const [img, setImg] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch images from the server
  const reFetchImages = () => {
    setLoading(true);
    fetch("http://localhost:5000/galleryImage")
      .then((res) => res.json())
      .then((data) => {
        setImg(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    reFetchImages();
  }, []);

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) return;

    const reorderedImages = [...img];
    const [movedItem] = reorderedImages.splice(source.index, 1);
    reorderedImages.splice(destination.index, 0, movedItem);
    setImg(reorderedImages);

    const featureImageId = reorderedImages[0]._id; // First image as featured
    fetch("http://localhost:5000/updateImageOrder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reorderedImages, featureImageId }),
    })
      .then((res) => res.json())
      .then(() => {
        reFetchImages();
      })
      .catch((error) => {
        console.error("Error updating image order:", error);
      });
  };

  const handleImageSelect = (id) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((imageId) => imageId !== id)
        : [...prevSelected, id]
    );
  };

  const handleDelete = () => {
    const featureImageId = img[0]._id; // ID of the featured image

    // Check if the feature image is in the selected images
    const imagesToDelete = selectedImages.includes(featureImageId)
      ? [...selectedImages] // Include the featured image in deletion
      : [...selectedImages, featureImageId]; // Ensure the featured image is included

    if (imagesToDelete.length === 0) {
      Swal.fire({
        title: "No Selection",
        text: "Please select images to delete.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete them!",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch("http://localhost:5000/galleryImage", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: imagesToDelete }),
        })
          .then((res) => res.json())
          .then(() => {
            setSelectedImages([]);
            reFetchImages(); // Re-fetch images to update the UI
          })
          .catch((error) => {
            console.error("Error deleting images:", error);
          });
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {loading ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="featured-image-container">
            {/* First image displayed as featured */}
            {img.length > 0 && (
              <div className="featured-image-wrapper relative">
                <img
                  src={img[0].imageUrl}
                  alt="Featured"
                  className="featured-image"
                />
                <div className="absolute top-2 left-2 bg-yellow-500 text-white p-2 text-sm font-bold">
                  Featured Image
                </div>
              </div>
            )}
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable-gallery">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-6 droppable-gallery"
                >
                  {img.slice(1).map(({ _id, imageUrl }, index) => (
                    <Draggable
                      draggableId={_id.toString()}
                      index={index + 1} // Adjust index due to featured image
                      key={_id.toString()}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="draggable-item relative"
                        >
                          {/* Image and hoverable checkbox */}
                          <div className="relative group">
                            <img
                              src={imageUrl}
                              alt={`Image-${index + 1}`}
                              className={`image-style ${
                                selectedImages.includes(_id) ? "selected" : ""
                              }`}
                              onClick={() => handleImageSelect(_id)}
                            />
                            <input
                              type="checkbox"
                              checked={selectedImages.includes(_id)}
                              onChange={() => handleImageSelect(_id)}
                              className={`absolute top-2 right-2 checkbox-style group-hover:opacity-100 ${
                                selectedImages.includes(_id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              }`}
                            />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {img.length > 0 && (
            <div className="text-center">
              <button
                onClick={handleDelete}
                className={`btn bg-purple-700 text-white mt-12 hover:bg-purple-500 ${
                  selectedImages.length === 0 && img.length === 1
                    ? "hidden"
                    : ""
                }`}
              >
                Delete Selected Images
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Images;
