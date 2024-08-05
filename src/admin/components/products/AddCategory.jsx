import React, { useState, useEffect } from "react";
import AdminMenu from "../adminMenu/AdminMenu";
import "./category.css";
import imageicon from "../../../img/imageicon.jpg";
import { AiOutlineDelete } from "react-icons/ai";
import { CiCamera } from "react-icons/ci";

const AddCategory = () => {
  return (
    <>
      <AdminMenu />
      <section id="posts">
        <div className="box_container_products">
          <div className="Box_btn_haed">
            <h2>Add Category</h2>
            <div className="btn_submit">
              <button type="submit">Post Category</button>
            </div>
          </div>

          <div className="group_container_product">
            <div>
              <div className="addProduct_box_content_afterThat">
                <div className="deleteBox_productconotent">
                  <AiOutlineDelete />
                </div>

                <div className="box_input-img">
                  <img src={imageicon} alt="default" />
                  <input type="file" required />
                </div>

                <div className="edit_images">
                  <label className="trigger_popup_fricc">
                    <CiCamera id="icon_ci_camera" />
                  </label>
                </div>
                <div className="box_container_image">
                  <div className="input-box">
                    <div className="box">
                      <input
                        type="text"
                        placeholder="Category name..."
                        required
                      />
                    </div>
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
