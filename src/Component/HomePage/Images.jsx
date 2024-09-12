import { useEffect, useState } from "react";
import "../../Component/gallery.css";
const Images = () => {
  const [img, setImg] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/galleryImage")
      .then((res) => res.json())
      .then((data) => {
        setImg(data);
        // console.log(data);
      });
  }, []);
  console.log(img);

  return (
    <div>
      <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {img?.map((images) => (
          <div key={images?._id}>
            <img src={images?.imageUrl} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Images;
