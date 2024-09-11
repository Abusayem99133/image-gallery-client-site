import { useEffect, useState } from "react";
import "../../Component/gallery.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [model, setModel] = useState(false);
  const [tempImage, setTempImage] = useState("");

  // Fetch gallery data from JSON file
  useEffect(() => {
    fetch("./gallery.json")
      .then((res) => res.json())
      .then((data) => setGallery(data));
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
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        {/* Set droppableId to uniquely identify this Droppable */}
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
                  draggableId={gal.id.toString()} // Draggable ID must be a string
                  index={index}
                >
                  {(provided) => (
                    <div
                      className="picture"
                      onClick={() => getImg(gal.image)}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <img src={gal.image} alt="" />
                    </div>
                  )}
                </Draggable>
              ))}
              {/* Placeholder for drag-and-drop */}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

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
