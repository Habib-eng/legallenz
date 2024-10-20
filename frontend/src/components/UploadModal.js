import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { gapi } from "gapi-script";
import GoogleDriveFileSelectorModal from "./GoogleDriveFileSelectorModal";

const SCOPES = "https://www.googleapis.com/auth/drive.readonly";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

const UploadModal = ({
  setSummary,
  setOriginalText,
  setDocumentFile,
  theme,
}) => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [title, setTitle] = useState("");
  const [googleAuth, setGoogleAuth] = useState(null);
  const [isGoogleAuthReady, setIsGoogleAuthReady] = useState(false);
  const [driveModalOpen, setDriveModalOpen] = useState(false);

  console.log(open, isUploaded);

  const initClient = () => {
    return new Promise((resolve, reject) => {
      gapi.load("client:auth2", () => {
        gapi.client
          .init({
            apiKey: process.env.REACT_APP_GOOGLE_DRIVE_API_KEY,
            clientId: process.env.REACT_APP_GOOGLE_DRIVE_CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          })
          .then(() => {
            const authInstance = gapi.auth2.getAuthInstance();
            setGoogleAuth(authInstance);
            setIsGoogleAuthReady(true);
            resolve();
          })
          .catch((error) => {
            console.error("Error initializing GAPI:", error);
            reject(error);
          });
      });
    });
  };

  useEffect(() => {
    initClient().catch((error) => {
      console.error("Google API client initialization failed:", error);
    });
  }, []);

  const handleGoogleLogin = async () => {
    if (isGoogleAuthReady && googleAuth) {
      try {
        await googleAuth.signIn();
        setDriveModalOpen(true);
      } catch (error) {
        console.error("Google sign-in failed:", error);
      }
    } else {
      console.error("GoogleAuth instance is not initialized yet.");
    }
  };

  const handleFileFromGoogleDrive = (selectedFile) => {
    setFile(selectedFile);
    setTitle(selectedFile.name);
    setDocumentFile(selectedFile);
  };

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
    setDocumentFile(acceptedFiles[0]);
    setTitle(acceptedFiles[0].name);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [],
    },
  });

  const handleUpload = async () => {
    if (!file || !title) return;

    const formData = new FormData();
    formData.append("File", file);
    formData.append("title", title);

    const userId = localStorage.getItem("userId");
    if (userId) {
      formData.append("userId", userId);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://docuthinker-ai-app.onrender.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      let originalText = response.data.originalText;

      const url = "https://api.openai.com/v1/chat/completions";

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
      };
      const summarySteps = `
Summarize the provided contract and highlight the key points effectively.

Focus on extracting important clauses, responsibilities, dates, parties involved, and any financial obligations mentioned. Ensure clarity and precision when explaining complex legal terms.

# Steps

1. *Read through the contract*: Identify the main sections and subsections.
2. *Extract key information*: Note important elements such as parties involved, effective dates, renewal terms, financial obligations, rights and responsibilities, termination clauses, and any significant legal jargon.
3. *Summarize each section*: Write concise summaries of each main section of the contract.
4. *Highlight key points*: Identify the most critical parts of the contract that need emphasis or special attention.

# Output Format

The summary should be a concise paragraph for each main section, followed by a bullet-point list of the key highlights.

# Examples

Example 1:

- *Input*: [Brief excerpt or description of a sample contract]
- *Output*:
  - *Section Summary*: "The parties involved in this contract are XYZ Corporation and ABC Ltd. The contract commences on January 1, 2022, with an automatic renewal clause every year unless terminated by either party. The financial obligation for XYZ Corporation includes a monthly payment of $5000 to ABC Ltd."
  - *Key Highlights*: 
    - Effective date: January 1, 2022
    - Parties: XYZ Corporation, ABC Ltd.
    - Monthly Payment Obligation: $5000
    - Renewal Terms: Automatic yearly renewal

(Note: Real examples should summarize more sections and include more detailed highlights when applicable.)

# Notes

Ensure confidentiality and sensitivity when dealing with actual contracts. Pay close attention to any confidentiality clauses or proprietary information.
you're response should be in French

`;
      const data = {
        model: "gpt-4o",
        messages: [
          { role: "system", content: summarySteps},
          { role: "user", content: originalText },
        ],
      };
      let responsee;
      try {
        responsee = await axios.post(url, data, { headers });
      } catch (error) {
        console.error(
          "Error calling ChatGPT API:",
          error.response ? error.response.data : error.message
        );
      }
      const result = responsee.data.choices[0].message.content;

      setLoading(false);
      setSummary(result);
      setOriginalText(originalText);
      localStorage.setItem("originalText", originalText);
      setIsUploaded(true);
      setOpen(false);
    } catch (error) {
      setLoading(false);
      console.error("Upload failed:", error);
    }
  };

  return (
    <>
      <div style={{ position: "relative", width: "100%", height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box
          sx={{
            width: { xs: "90%", sm: "70%", md: "400px" },
            maxHeight: "90vh",
            padding: { xs: 2, sm: 4 },
            bgcolor: theme === "dark" ? "#1e1e1e" : "white",
            textAlign: "center",
            borderRadius: "12px",
            transition: "background-color 0.3s ease",
            color: theme === "dark" ? "white" : "black",
            overflowY: "auto",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            pointerEvents: "auto",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              marginBottom: 2,
              font: "inherit",
              fontSize: { xs: "16px", sm: "18px" },
              color: theme === "dark" ? "white" : "black",
              transition: "color 0.3s ease",
            }}
          >
            Upload a document (PDF or DOCX)
          </Typography>

          <Box
            {...getRootProps()}
            sx={{
              border: `2px dashed ${theme === "dark" ? "white" : "#f57c00"}`,
              padding: { xs: 2, sm: 4 },
              cursor: "pointer",
              marginBottom: 2,
              transition: "border-color 0.3s ease",
            }}
          >
            <input {...getInputProps()} />
            <Typography
              variant="body1"
              sx={{
                font: "inherit",
                color: theme === "dark" ? "white" : "black",
                transition: "color 0.3s ease",
              }}
            >
              Drag & drop a file here, or click to select
            </Typography>
          </Box>

          {file && (
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                font: "inherit",
                color: theme === "dark" ? "white" : "black",
                transition: "color 0.3s ease",
              }}
            >
              {file.name}
            </Typography>
          )}

          {file && (
            <TextField
              label="Document Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              sx={{ marginBottom: 2, font: "inherit" }}
              inputProps={{
                style: {
                  fontFamily: "Poppins, sans-serif",
                  color: theme === "dark" ? "white" : "black",
                },
              }}
              InputLabelProps={{
                style: {
                  fontFamily: "Poppins, sans-serif",
                  color: theme === "dark" ? "white" : "#000",
                },
              }}
            />
          )}

          <Button
            variant="contained"
            sx={{
              bgcolor: "#f57c00",
              color: "white",
              font: "inherit",
              transition: "background-color 0.3s ease",
              width: "100%",
            }}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Upload"
            )}
          </Button>

          <Typography sx={{ mt: 2, font: "inherit" }}>OR</Typography>

          <Button
            variant="contained"
            sx={{
              bgcolor: "#4285F4 !important",
              color: "white !important",
              font: "inherit",
              mt: 2,
              width: "100%",
              "&:hover": {
                bgcolor: "#3367D6 !important",
              },
            }}
            onClick={handleGoogleLogin}
            disabled={!isGoogleAuthReady}
          >
            {isGoogleAuthReady
              ? "Select from Google Drive"
              : "Loading Google Auth..."}
          </Button>

          <Typography
            sx={{
              mt: 3,
              font: "inherit",
              color: theme === "dark" ? "white" : "black",
              fontSize: "14px",
            }}
          >
            <em>
              Note that our servers might be slow or experience downtime due to
              high traffic, or they may spin down after periods of inactivity. It
              may take up to 2 minutes to process your document during these
              times. We appreciate your patience, and apologize for any
              inconvenience.
            </em>
          </Typography>
        </Box>

        <GoogleDriveFileSelectorModal
          open={driveModalOpen}
          handleClose={() => setDriveModalOpen(false)}
          googleAuth={googleAuth}
          onFileSelect={handleFileFromGoogleDrive}
          theme={theme}
        />
      </div>
    </>
  );
};

export default UploadModal;
