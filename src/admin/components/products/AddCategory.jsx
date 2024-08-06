import React, { useEffect, useState } from "react";
import AdminMenu from "../adminMenu/AdminMenu";
import "./category.css";
import imageicon from "../../../img/imageicon.jpg";
import { CiCamera } from "react-icons/ci";
import axios from 'axios';

const AddCategory = () => {
  const [categories, set_categories] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = React.createRef();

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    const submitCategory = async () => {
      const formData = new FormData();
      formData.append('name', 'kk2');
      formData.append('image', selectedImage);

      try {
        const response = await axios.post('http://43.201.158.188:8000/store/categories', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(JSON.stringify(response.data));
      } catch (error) {
        console.error('Error uploading category:', error);
      }
    };

    if (selectedImage) {
      submitCategory();
    }
  }, [selectedImage]);

  return (
    <>
      <AdminMenu />
      <section id="posts">
        <div className="box_container_products">
          <div className="Box_btn_haed">
            <h2>Add Category</h2>
            <div className="btn_submit">
              <button type="submit" onClick={handleSubmit}>Post Category</button>
            </div>
          </div>

          <div className="group_container_category">
            <div className="Category_box_content">
              <div className="box_input-img">
                <img src={selectedImage || imageicon} alt="category" />
                <input 
                  type="file" 
                  style={{ display: "none" }} 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                />
              </div>

              <div className="edit_images">
                <label className="trigger_popup_fricc" onClick={handleCameraClick}>
                  <CiCamera id="icon_ci_camera" />
                </label>
              </div>
              <div className="box_container_image">
                <div className="input-box">
                  <div className="box">
                    <input
                      type="text"
                      placeholder="Category name..."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddCategory;
