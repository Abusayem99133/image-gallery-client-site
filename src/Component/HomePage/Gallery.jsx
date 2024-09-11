import { useEffect, useState } from "react";
import "../../Component/gallery.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [model, setModel] = useState(false);
  const [tempImage, setTempImage] = useState("");
  const [featureImage, setFeatureImage] = useState("");
  const [selectedImages, setSelectedImages] = useState([]); // Store selected image ids

  // Fetch gallery data from JSON file
  useEffect(() => {
    fetch("./gallery.json")
      .then((res) => res.json())
      .then((data) => {
        setGallery(data);
        if (data.length > 0) {
          setFeatureImage(data[0].image); // Set the first image as the feature image
        }
      });
  }, []);

  // Open image in modal
  const getImg = (imgSrc) => {
    setTempImage(imgSrc);
    setModel(true); // Show modal
  };

  // Handle drag end and reordering of images
  const onDragEnd = (result) => {
    const { destination, source } = result;

    // Check if the item was dropped outside the list
    if (!destination) return;

    // Reordering logic
    const reorderedGallery = Array.from(gallery);
    const [movedItem] = reorderedGallery.splice(source.index, 1); // Remove dragged item
    reorderedGallery.splice(destination.index, 0, movedItem); // Insert at the dropped location

    setGallery(reorderedGallery); // Update state with new order
    setFeatureImage(reorderedGallery[0].image); // Update the first image as the feature image
  };

  // Select or deselect an image
  const toggleSelectImage = (id) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter((imgId) => imgId !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  // Delete selected images
  const deleteSelectedImages = () => {
    const updatedGallery = gallery.filter(
      (gal) => !selectedImages.includes(gal.id)
    );
    setGallery(updatedGallery);
    setSelectedImages([]);
    if (updatedGallery.length > 0) {
      setFeatureImage(updatedGallery[0].image); // Set new feature image
    } else {
      setFeatureImage("");
    }
  };

  return (
    <>
      <div className="feature-image">
        <h3>Feature Image:</h3>
        {featureImage && <img src={featureImage} alt="Feature" />}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="gallery-droppable">
          {(provided) => (
            <div
              className="gallery mt-12"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {gallery.map((gal, index) => (
                <Draggable
                  key={gal.id}
                  draggableId={gal.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      className={`picture ${
                        selectedImages.includes(gal.id) ? "selected" : ""
                      }`}
                      onClick={() => toggleSelectImage(gal.id)}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <input
                        type="checkbox"
                        checked={selectedImages.includes(gal.id)}
                        onChange={() => toggleSelectImage(gal.id)}
                        className="checkbox-overlay"
                      />
                      <img src={gal.image} alt={gal.name} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Delete Button */}
      {selectedImages.length > 0 && (
        <button className="delete-button" onClick={deleteSelectedImages}>
          Delete Selected Images
        </button>
      )}

      {/* Image modal */}
      <div
        className={model ? "model open" : "model"}
        onClick={() => setModel(false)}
      >
        <img src={tempImage} alt="" />
      </div>
    </>
  );
};

export default Gallery;
