import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { formatPhoneNumber } from "@src/utils/utils";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { RootState } from "@src/redux/rootReducer";
import { BlobServiceClient } from "@azure/storage-blob";
import { logout, update } from "@src/redux/reducers/authReducer";
import { PencilIcon } from "@src/app/icons";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod, IUser } from "@/common_utils/types";
import styles from "./AccountEditModal.module.css";
import Chip from "../Chip/Chip";

export default function Profile() {
  const [edit, setEdit] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    birthDate,
    imageLink,
    chapter,
    role,
    adminDetails: { active },
  } = useSelector((state: RootState) => state.auth);
  const [updatedFirstName, setUpdatedFirstName] = useState<string>(firstName);
  const [updatedLastName, setUpdatedLastName] = useState<string>(lastName);
  const [updatedPhoneNumber, setUpdatedPhoneNumber] =
    useState<string>(phoneNumber);
  const [updatedEmail, setUpdatedEmail] = useState<string>(email);

  function formatDateToString(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }
  const [unupdatedBirthDate, setUnupdatedBirthDate] = useState(
    new Date(birthDate),
  );
  const [updatedBirthDate, setUpdatedBirthDate] = useState(new Date(birthDate));
  const [updatedBirthDateInput, setUpdatedBirthDateInput] = useState(
    formatDateToString(new Date(birthDate)),
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [tempImageLink, setTempImageLink] = useState<string | null>(null);

  useEffect(() => {
    if (updatedBirthDateInput) {
      const dateArray = updatedBirthDateInput.split("/");
      if (dateArray.length === 3) {
        const [month, day, year] = dateArray.map(Number);
        const updatedDate = new Date(year, month - 1, day);
        if (!Number.isNaN(updatedDate.getTime())) {
          setUpdatedBirthDate(updatedDate);
        }
      }
    }
  }, [updatedBirthDateInput]);

  const handleEdit = () => {
    setEdit(true);
  };

  // CORE IMPLEMENTATION
  const uploadAzureImage = useCallback(async () => {
    try {
      if (!selectedImage) {
        throw new Error("No image selected");
      }
      const fileExtension = selectedImage.name.split(".").pop();

      const res = await internalRequest<{
        sasToken: string;
        blobName: string;
      }>({
        url: "/api/volunteer/profile-image/sas-token",
        method: HttpMethod.GET,
        queryParams: {
          extension: fileExtension,
        },
      });

      const { sasToken } = res;

      if (!sasToken) {
        throw new Error("sasToken is undefined");
      }

      const blobServiceClient = new BlobServiceClient(
        `https://beiaccount.blob.core.windows.net/?${res.sasToken}`,
      );
      const containerClient =
        blobServiceClient.getContainerClient("profileimage");
      const blobClient = containerClient.getBlockBlobClient(res.blobName);
      await blobClient.uploadData(selectedImage);

      return `https://beiaccount.blob.core.windows.net/profileimage/${res.blobName}`;
    } catch (e) {
      const error = e as Error;
      throw new Error(`Error uploading image:${error.message}`);
    }
  }, [selectedImage]);

  const uploadProfileImage = useCallback(async () => {
    const imgURL = await uploadAzureImage();

    // Store the new image link in the MongoDB record and delete the old image from Azure
    await internalRequest({
      url: "/api/volunteer/profile-image/image-link",
      method: HttpMethod.POST,
      body: { newImageLink: imgURL, email },
    });
    return imgURL;
  }, [uploadAzureImage, email]);

  const handleSaveChanges = useCallback(async () => {
    if (selectedImage) {
      await uploadProfileImage();
    }

    const updatedUser = await internalRequest<IUser>({
      url: "/api/volunteer",
      method: HttpMethod.PATCH,
      authRequired: true,
      body: {
        email,
        newFields: {
          firstName: updatedFirstName,
          lastName: updatedLastName,
          phoneNumber: updatedPhoneNumber,
          email: updatedEmail,
          birthDate: updatedBirthDate,
        },
      },
    });

    setTempImageLink(null);

    // Logout user if email is changed so they can reauthenticate
    if (updatedEmail !== email) {
      dispatch(logout());
      router.push("/auth/login");
    }

    dispatch(update(updatedUser));
    setUnupdatedBirthDate(updatedBirthDate);
    setEdit(false);
  }, [
    dispatch,
    email,
    router,
    selectedImage,
    updatedBirthDate,
    updatedEmail,
    updatedFirstName,
    updatedLastName,
    updatedPhoneNumber,
    uploadProfileImage,
  ]);

  const handleCancel = () => {
    setSelectedImage(null);
    setTempImageLink(null);
    setUpdatedFirstName(firstName);
    setUpdatedLastName(lastName);
    setUpdatedPhoneNumber(phoneNumber);
    setUpdatedEmail(email);
    setUpdatedBirthDate(unupdatedBirthDate);
    setUpdatedBirthDateInput(unupdatedBirthDate.toLocaleDateString("en-US"));
    setEdit(false);
  };

  const formatBirthDate = (input: string): string => {
    const numericInput: string = input.replace(/\D/g, "");
    const maxLength = 8;
    const truncatedInput = numericInput.slice(0, maxLength);
    let formattedInput = "";
    for (let i = 0; i < truncatedInput.length; i += 1) {
      if (i === 2 || i === 4) {
        formattedInput += "/";
      }
      formattedInput += truncatedInput[i];
    }
    return formattedInput;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length > 10) return;
    setUpdatedPhoneNumber(rawValue);
  };

  const openDialog = () => {
    fileInputRef.current?.click();
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files === null || e.target.files.length < 1) {
      return;
    }

    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileSizeInMB = selectedFile.size / (1024 * 1024);
      const maxSizeMB = 5;

      if (fileSizeInMB > maxSizeMB) {
        throw new Error("Selected file exceeds the maximum size limit of 5 MB");
      }
      setSelectedImage(selectedFile);
      setTempImageLink(URL.createObjectURL(selectedFile));
    }
  };

  return (
    <>
      <div className={styles.header}>
        <div>
          <div>
            <img
              src={tempImageLink || imageLink}
              alt="Profile Image"
              className={styles.profileImage}
              onClick={openDialog}
              style={{
                width: "120px",
                height: "120px",
                cursor: edit ? "pointer" : "",
              }}
            />

            {edit && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            )}
          </div>
        </div>
        <div className={styles.myContainer}>
          <div className={styles.first}>
            <label>{`${firstName} ${lastName}`}</label>
          </div>
          <div className={styles.second}>
            <div>{chapter}</div>
          </div>
          <div className={styles.third}>
            <Chip className={styles.tag} color="#E3EAFC">
              {role}
            </Chip>
            {active ? (
              <Chip className={styles.tag} color="#D6F6EA">
                Active
              </Chip>
            ) : (
              <Chip className={styles.tag} color="#FCDCE2">
                Inactive
              </Chip>
            )}
          </div>
        </div>
      </div>
      <div className={styles.inputs}>
        <div className={styles.inputHeader}>
          <label>Profile Details</label>
          <button
            className={`${styles.editButton} ${edit ? styles.disabled : ""}`}
            style={{ marginLeft: "auto" }}
            onClick={handleEdit}
            disabled={edit}
          >
            <PencilIcon />
          </button>
        </div>
        <div className={styles.inputFieldRow}>
          <div className={styles.inputField}>
            <label>First Name</label>
            <input
              placeholder="First Name"
              value={updatedFirstName}
              onChange={(e) => setUpdatedFirstName(e.target.value)}
              className={!edit ? styles.nonEditable : styles.editable}
              readOnly={!edit}
            />
          </div>
          <div className={styles.inputField}>
            <label>Last Name</label>
            <input
              placeholder="Last Name"
              value={updatedLastName}
              onChange={(e) => setUpdatedLastName(e.target.value)}
              className={!edit ? styles.nonEditable : styles.editable}
              readOnly={!edit}
            />
          </div>
        </div>

        <div className={styles.inputField}>
          <label>Date of Birth</label>
          <input
            placeholder="mm/dd/yyyy"
            value={updatedBirthDateInput}
            onChange={(e) => {
              const formattedDate = formatBirthDate(e.target.value);
              setUpdatedBirthDateInput(formattedDate);
            }}
            className={!edit ? styles.nonEditable : styles.editable}
            readOnly={!edit}
          />
        </div>

        <div className={styles.inputField}>
          <label>Phone</label>
          <input
            placeholder="(123) 456-7890"
            value={formatPhoneNumber(updatedPhoneNumber) || ""}
            onChange={(e) => {
              handlePhoneChange(e);
            }}
            className={!edit ? styles.nonEditable : styles.editable}
            readOnly={!edit}
          />
        </div>

        <div className={styles.inputField}>
          <label>Email:</label>
          <input
            placeholder="blankemail@gmail"
            value={updatedEmail}
            onChange={(e) => setUpdatedEmail(e.target.value)}
            className={!edit ? styles.nonEditable : styles.editable}
            readOnly={!edit}
          />
        </div>
        {edit && (
          <div className={styles.buttons}>
            <button
              onClick={handleCancel}
              className={`${styles.submitButton} ${styles.disabled}`}
            >
              Cancel
            </button>
            <button className={styles.submitButton} onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </>
  );
}
