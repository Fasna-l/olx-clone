import { Modal, ModalBody } from "flowbite-react";
import { useState } from "react";
import Input from "../Input/Input";
import { UserAuth } from "../Context/Auth";
import { addDoc, collection } from "firebase/firestore";
import { fetchFromFirestore, fireStore } from "../Firebase/Firebase";
import fileUpload from "../../assets/fileUpload.svg";
import loading from "../../assets/loading.gif";
import close from "../../assets/close.svg";

const Sell = (props) => {
  const { toggleModalSell, status, setItems } = props;

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  // All validation errors are stored here
  const [errors, setErrors] = useState({});

  const [submitting, setSubmitting] = useState(false);

  const auth = UserAuth();

  // Clear error for a particular field
  const clearError = (field) => {
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // Image validation
  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/svg+xml",
      "image/png",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only SVG, PNG, and JPG images are allowed",
      }));

      event.target.value = "";
      setImage(null);

      return;
    }

    setImage(file);

    // Remove image error when valid image is selected
    clearError("image");
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Please enter a title";
    }

    if (!category.trim()) {
      newErrors.category = "Please enter a category";
    }

    if (!price.trim()) {
      newErrors.price = "Please enter a price";
    } else if (
      isNaN(price.trim()) ||
      Number(price.trim()) <= 0
    ) {
      newErrors.price = "Please enter a valid price";
    }

    if (!description.trim()) {
      newErrors.description = "Please enter a description";
    }

    if (!image) {
      newErrors.image = "Please upload an image";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous general errors
    setErrors({});

    // Check login
    if (!auth?.user) {
      setErrors({
        auth: "Please login to continue",
      });

      return;
    }

    // Check form validation
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    // Convert image to Data URL
    const readImageAsDataUrl = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const imageUrl = reader.result;
          resolve(imageUrl);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
      });
    };

    let imageUrl = "";

    try {
      imageUrl = await readImageAsDataUrl(image);
    } catch (error) {
      console.log(error);

      setErrors({
        image: "Failed to read the image. Please try another image.",
      });

      setSubmitting(false);

      return;
    }

    try {
      // Add product to Firestore
      await addDoc(collection(fireStore, "products"), {
        title: title.trim(),
        category: category.trim(),
        price: price.trim(),
        description: description.trim(),
        imageUrl,
        userId: auth.user.uid,
        userName: auth.user.displayName || "Anonymous",
        createAt: new Date().toDateString(),
      });

      // Clear form
      setTitle("");
      setCategory("");
      setPrice("");
      setDescription("");
      setImage(null);
      setErrors({});

      // Refresh products
      const datas = await fetchFromFirestore();

      setItems(datas);

      // Close modal
      toggleModalSell();

    } catch (error) {
      console.log(error);

      setErrors({
        submit: "Failed to add the item. Please try again.",
      });

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Modal
        theme={{
          content: {
            base: "relative w-full p-4 md:h-auto",
            inner:
              "relative flex max-h-[90dvh] flex-col rounded-lg bg-white shadow dark:bg-gray-700",
          },
        }}
        onClick={toggleModalSell}
        show={status}
        className="bg-black"
        position={"center"}
        size="md"
        popup={true}
      >
        <ModalBody
          className="bg-white h-96 p-0 rounded-md"
          onClick={(event) => event.stopPropagation()}
        >
          {/* Close button */}
          <img
            onClick={() => {
              toggleModalSell();
              setImage(null);
              setErrors({});
            }}
            className="w-6 absolute z-10 top-6 right-8 cursor-pointer"
            src={close}
            alt="Close"
          />

          <div className="p-6 pl-8 pr-8 pb-8">

            <p className="font-bold text-lg mb-3">
              Sell Item
            </p>

            <form onSubmit={handleSubmit}>

              {/* Login error */}
              {errors.auth && (
                <p
                  className="text-red-500 text-sm mb-2 text-center"
                  role="alert"
                >
                  {errors.auth}
                </p>
              )}

              {/* Title */}
              <Input
                setInput={(value) => {
                  setTitle(value);
                  clearError("title");
                }}
                placeholder="Title"
                error={errors.title}
              />

              {/* Category */}
              <Input
                setInput={(value) => {
                  setCategory(value);
                  clearError("category");
                }}
                placeholder="Category"
                error={errors.category}
              />

              {/* Price */}
              <Input
                setInput={(value) => {
                  setPrice(value);
                  clearError("price");
                }}
                placeholder="Price"
                type="number"
                error={errors.price}
              />

              {/* Description */}
              <Input
                setInput={(value) => {
                  setDescription(value);
                  clearError("description");
                }}
                placeholder="Description"
                error={errors.description}
              />

              {/* Image upload */}
              <div className="pt-2 w-full relative">

                {image ? (
                  <div
                    className={`relative h-40 sm:h-60 w-full flex justify-center border-2 ${
                      errors.image
                        ? "border-red-500"
                        : "border-black"
                    } border-solid rounded-md overflow-hidden`}
                  >
                    <img
                      className="object-contain"
                      src={URL.createObjectURL(image)}
                      alt="Selected item"
                    />
                  </div>
                ) : (
                  <div
                    className={`relative h-40 sm:h-60 w-full border-2 ${
                      errors.image
                        ? "border-red-500"
                        : "border-black"
                    } border-solid rounded-md`}
                  >
                    <input
                      onChange={handleImageUpload}
                      type="file"
                      accept=".svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                    />

                    <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col items-center">

                      <img
                        className="w-12"
                        src={fileUpload}
                        alt="Upload"
                      />

                      <p className="text-center text-sm pt-2">
                        Click to upload images
                      </p>

                      <p className="text-center text-sm pt-2">
                        SVG, PNG, JPG
                      </p>

                    </div>
                  </div>
                )}

                {/* Image error */}
                {errors.image && (
                  <p
                    className="text-red-500 text-sm mt-1"
                    role="alert"
                  >
                    {errors.image}
                  </p>
                )}

              </div>

              {/* Firestore/general submit error */}
              {errors.submit && (
                <p
                  className="text-red-500 text-sm mt-2 text-center"
                  role="alert"
                >
                  {errors.submit}
                </p>
              )}

              {/* Submit button / loading */}
              {submitting ? (
                <div className="w-full flex h-14 justify-center pt-4 pb-2">
                  <img
                    className="w-32 object-cover"
                    src={loading}
                    alt="Loading"
                  />
                </div>
              ) : (
                <div className="w-full pt-2">

                  <button
                    type="submit"
                    className="w-full p-3 rounded-lg text-white"
                    style={{
                      backgroundColor: "#002f34",
                    }}
                  >
                    Sell Item
                  </button>

                </div>
              )}

            </form>

          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Sell;