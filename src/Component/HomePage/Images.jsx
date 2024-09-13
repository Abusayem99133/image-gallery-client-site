import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Swal from "sweetalert2";
import "../../Component/gallery.css";

const Images = () => {
  const [img, setImg] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch the images from the backend
  useEffect(() => {
    setLoading(true); // Set loading to true when fetching starts
    fetch("http://localhost:5000/galleryImage")
      .then((res) => res.json())
      .then((data) => {
        setImg(data);
        setLoading(false); // Set loading to false when fetching completes
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
        setLoading(false); // Ensure loading is set to false on error
      });
  }, []);

  // Handle drag-and-drop functionality
  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination || destination.index === source.index) return;

    const reorderedImages = [...img];
    const [movedItem] = reorderedImages.splice(source.index, 1);
    reorderedImages.splice(destination.index, 0, movedItem);
    setImg(reorderedImages);

    fetch("http://localhost:5000/updateImageOrder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reorderedImages }),
    });
  };

  // Handle image selection for deletion
  const handleImageSelect = (id) => {
    setSelectedImages((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((imageId) => imageId !== id)
        : [...prevSelected, id]
    );
  };

  // Handle multiple delete
  const handleDelete = () => {
    if (selectedImages.length === 0) {
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
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleting Images",
          text: "Please wait while we delete the selected images.",
          icon: "info",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // Show the loader
          },
        });

        fetch("http://localhost:5000/galleryImage", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: selectedImages }),
        })
          .then((res) => res.json())
          .then((data) => {
            Swal.close(); // Close the loader
            if (data.message === "Images deleted successfully") {
              Swal.fire({
                title: "Deleted!",
                text: "Selected images have been deleted.",
                icon: "success",
                confirmButtonText: "Okay",
              });
              setImg((prevImg) =>
                prevImg.filter((image) => !selectedImages.includes(image._id))
              );
              setSelectedImages([]); // Reset selection
            } else {
              Swal.fire({
                title: "Error",
                text: data.message,
                icon: "error",
                confirmButtonText: "Retry",
              });
            }
          })
          .catch((error) => {
            Swal.close(); // Close the loader
            console.error("Error deleting images:", error);
            Swal.fire({
              title: "Error",
              text: "There was an issue deleting the images.",
              icon: "error",
              confirmButtonText: "Retry",
            });
          });
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {loading ? ( // Display loader while fetching
        <div className="loader-container">
          <div className="spinner"></div> {/* Add your spinner here */}
        </div>
      ) : (
        <>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable-gallery">
              {(provided) => (
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 droppable-gallery"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {img.map(({ _id, imageUrl }, index) => (
                    <Draggable
                      draggableId={_id.toString()}
                      index={index}
                      key={_id}
                    >
                      {(provided) => (
                        <div
                          key={_id}
                          ref={provided.innerRef}
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          className="draggable-item"
                        >
                          <img
                            src={imageUrl}
                            alt={`Image-${index}`}
                            className={`image-style ${
                              selectedImages.includes(_id) ? "selected" : ""
                            }`}
                            onClick={() => handleImageSelect(_id)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <button
            onClick={handleDelete}
            className="btn bg-purple-700 text-white mt-12"
          >
            Delete Selected Images
          </button>
        </>
      )}
    </div>
  );
};

export default Images;
