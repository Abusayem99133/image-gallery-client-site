import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../../Component/gallery.css";

const Images = () => {
  const [img, setImg] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/galleryImage")
      .then((res) => res.json())
      .then((data) => {
        setImg(data);
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) return;

    const reorderedImages = Array.from(img);
    const [movedItem] = reorderedImages.splice(source.index, 1);
    reorderedImages.splice(destination.index, 0, movedItem);

    setImg(reorderedImages);
  };

  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable-gallery">
          {(provided) => (
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {img?.map((images, index) => (
                <Draggable
                  key={images?._id}
                  draggableId={images?._id?.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="draggable-item"
                    >
                      <img
                        src={images?.imageUrl}
                        alt={`Image-${index}`}
                        className="image-style"
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
    </div>
  );
};

export default Images;
