import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import ReactMarkdown from "react-markdown";
import UploadModal from "../components/UploadModal";
import ChatModal from "../components/ChatModal";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ArticleCard from "../components/ArticleCard";

const Home = ({ theme }) => {
  const [summary, setSummary] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [keyIdeas, setKeyIdeas] = useState("");
  const [discussionPoints, setDiscussionPoints] = useState("");
  const [loadingKeyIdeas, setLoadingKeyIdeas] = useState(false);
  const [loadingDiscussionPoints, setLoadingDiscussionPoints] = useState(false);
  const [documentFile, setDocumentFile] = useState(null);

  console.log("documentFile:", documentFile);

  const location = useLocation();

  useEffect(() => {
    if (location.state) {
      const { summary, originalText } = location.state;
      setSummary(summary);
      setOriginalText(originalText);
    }
  }, [location.state]);

  const formatAsMarkdown = (text) => {
    const paragraphs = text.split(/\n\s*\n/);
    return paragraphs.map((para) => para.trim()).join("\n\n");
  };

  const mock = [
    {
      "content": "Le présent contrat est un contrat de prestation de conseil ayant pour objet la mission définie au cahier des charges annexé au présent contrat et en faisant partie intégrante.",
      "explanation": "This article defines the purpose of the contract, which is to provide consultancy services. The specific tasks and responsibilities of the consulting mission are outlined in an annex attached to the contract, ensuring that both parties have a clear understanding of what is expected.",
      "riskAssessment": "Low: Clearly defining the object of the contract in conjunction with a detailed annex minimizes misunderstandings and disputes about the scope of the services.",
      "riskLevel": 0
    },
    {
      "content": "En contrepartie de la réalisation des prestations définies à l'Article premier ci-dessus, le client versera au prestataire la somme forfaitaire de _______________ euros, ventilée de la manière suivante: 20% à la signature des présentes ; 30% au (n) jour suivant la signature des présentes ; 50% constituant le solde, à la réception de la tâche. Les frais engagés par le prestataire : déplacement, hébergement, repas et frais annexes de dactylographie, reprographie, etc., nécessaires à l'exécution de la prestation, seront facturés en sus au client sur relevé de dépenses. Les sommes prévues ci-dessus seront payées par chèque, dans les huit jours de la réception de la facture, droits et taxes en sus.",
      "explanation": "This article specifies the financial terms. It includes a fixed sum that the client will pay the service provider, broken down into installments at various stages. Additional expenses related to the service execution will be charged to the client. Payments will be made by check within eight days of receiving the invoice.",
      "riskLevel": 50,
      "riskAssessment": "Medium: While payment terms are clear, the additional expenses could introduce variability into the total cost, affecting the client's budget. Parties should monitor and agree on these expenses beforehand."
    },
    {
      "content": "Ce contrat est passé pour une durée de _________ ans. Il prendra effet le ________ et arrivera à son terme le ___________.",
      "riskLevel": 100,
      "explanation": "This article sets the duration of the contract, specifying the start and end dates. It provides a clear timeframe for the execution of services.",
      "riskAssessment": "Low: Clear contractual duration helps manage expectations and aligns both parties on the commencement and conclusion of obligations."
    },

    {
      "content": "Le prestataire s'engage à mener à bien la tâche précisée à l'Article premier...",
      "riskLevel": 100,
      "explanation": "This article outlines the provider's commitment to completing the specified tasks to professional standards. It includes a collaboration obligation from the Client and optional obligations regarding access and approval of reports.",
      "riskAssessment": "Medium: Successful project execution requires the Client to provide necessary information and timely feedback. Misalignment can cause delays or disputes."
    },
    {
      "riskLevel": 0,
      "content": "La phase 1 définie...",
      "explanation": "This article lays out the timeline for the project, specifying due dates for each phase and the final report.",
      "riskAssessment": "Medium: Delays in any phase can cascade and affect subsequent stages, putting pressure on the overall timeline and potentially leading to penalties."
    },
    {
      "riskLevel": 50,
      "content": "La présente obligation, n'est, de convention expresse, que pure obligation de moyens.",
      "explanation": "The provider's obligation is one of means (not results), meaning they must use their best efforts but not guarantee outcomes.",
      "riskAssessment": "Medium: The distinction between a means and an obligation of results may lead to disputes if the Client's expectations for outcomes are not met."
    },
    {
      "riskLevel": 50,
      "content": "Le prestataire de services s'engage à maintenir un programme d'assurance qualité...",
      "explanation": "This article ensures that the service provider will maintain a quality assurance program, adhering to predefined standards.",
      "riskAssessment": "Low: Quality assurance programs provide a structured approach to maintaining service standards, reducing performance variability."
    },
    {
      "riskLevel": 100,
      "content": "Le prestataire considèrera comme strictement confidentiel...",
      "explanation": "This confidentiality agreement prohibits the provider from disclosing any information obtained during the contract unless the information is already public, pre-known, or obtained legally from a third party.",
      "riskAssessment": "High: Breaching confidentiality could result in significant reputational damage and legal consequences for both parties."
    },
    {
      "riskLevel": 100,
      "content": "De convention expresse, les résultats de l'étude seront en la pleine maîtrise du Client...",
      "explanation": "Specifies that the Client owns the results of the study once full payment is made, restricting the provider from using these results without the Client's consent.",
      "riskAssessment": "Low: Assigning ownership and use rights clearly reduces future intellectual property disputes."
    },
    {
      "riskLevel": 0,
      "content": "Toute méconnaissance des délais...",
      "explanation": "This article enforces penalties for the provider if service deliverables are delayed beyond agreed timelines.",
      "riskAssessment": "Medium: Enforces discipline in timelines but could strain the provider if delays are caused by factors beyond their direct control."
    },
    {
      "riskLevel": 50,
      "content": "Tout manquement de l'une ou l'autre des parties...",
      "explanation": "Describes conditions under which the contract can be terminated and the process for doing so, including providing a breach notice.",
      "riskAssessment": "High: Missed obligations leading to contract termination involve significant risk, making compliance critical."
    },
    {
      "riskLevel": 100,
      "content": "Les tâches précisées à l'Article premier...",
      "explanation": "Details that certain phases of the project may be subcontracted, with client acknowledgement.",
      "riskAssessment": "Medium: While subcontracting can offer benefits, it may result in quality control issues or complicate the management for the primary provider."
    },
    {
      "riskLevel": 100,
      "content": "Les parties reconnaissent que...",
      "explanation": "This clause addresses situations where unforeseen changes significantly affect one party's ability to meet the contract terms, allowing for renegotiation.",
      "riskAssessment": "Medium: Provides flexibility for unforeseen circumstances, but reliance on subjective interpretation could lead to disputes."
    },
    {
      "riskLevel": 0,
      "content": "On entend par force majeure...",
      "explanation": "Defines force majeure events and their effect on the contract, suspending obligations during such events.",
      "riskAssessment": "Low: Standard force majeure clause protects both parties from liabilities related to uncontrollable events."
    },
    {
      "riskLevel": 50,
      "content": "Le contrat est régi par la loi du pays...",
      "explanation": "Indicates the applicable legal jurisdiction and identifies the authoritative language version of the contract.",
      "riskAssessment": "Low: Establishing legal jurisdiction provides clarity and predictability for legal proceedings."
    },
    {
      "content": "Toutes contestations qui découlent...",
      "riskLevel": 100,
      "explanation": "Specifies that disputes will be resolved through arbitration under the International Chamber of Commerce rules, foregoing ordinary court proceedings.",
      "riskAssessment": "Medium: Arbitration is generally faster but can be costly and offers limited grounds for appealing decisions."
    }
  ]
  const handleGenerateIdeas = async () => {
    setLoadingKeyIdeas(true);
    const url = "https://api.openai.com/v1/chat/completions";

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer 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`,
    };

    const prompt = `For each article in a French contract, provide the original article text, a clear explanation, and a risk rating.

- Start by presenting the original text of the article in French.
- Explain the article in plain language, detailing its purpose, implications, and any relevant context.
- Assess and state the level of risk associated with the article from a legal, financial, or operational perspective.

# Steps

1. *Present Original Article*: Include the verbatim text of the article in French.
2. *Explain Article*: Provide a clear and concise explanation of the article, interpreting its terms and detailing its intended meaning and function.
3. *Assess Risk*: Determine the risk level of the article, considering potential liabilities, obligations, or financial implications.

# Output Format

- *Article*: [French text of the article]
- *Explanation*: [Explanation in clear language]
- *Risk Assessment*: [Risk level]

# Notes

- Consider articles individually and evaluate them based on context.
- Risk levels can be classified as: Low, Medium, High.
- Provide objective analyses free of personal bias or opinion.
- your answer should be in the language of the contract`;

    const data = {
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: originalText },
      ],
    };
    let responsee;
    try {
      responsee = await axios.post(url, data, { headers });
      const result = responsee.data.choices[0].message.content;
      const formattedKeyIdeas = formatAsMarkdown(result);
      setKeyIdeas(formattedKeyIdeas);
    } catch (error) {
      console.error("Failed to generate key ideas:", error);
    } finally {
      setLoadingKeyIdeas(false);
    }
  };

  const handleGenerateDiscussionPoints = async () => {
    setLoadingDiscussionPoints(true);
    try {
      const response = await axios.post(
        "https://docuthinker-ai-app.onrender.com/generate-discussion-points",
        {
          documentText: originalText,
        },
      );
      const formattedDiscussionPoints = formatAsMarkdown(
        response.data.discussionPoints,
      );
      setDiscussionPoints(formattedDiscussionPoints);
    } catch (error) {
      console.error("Failed to generate discussion points:", error);
    } finally {
      setLoadingDiscussionPoints(false);
    }
  };

  const handleUploadNewDocument = () => {
    // Reload the page when the button is clicked
    window.location.reload();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        padding: 4,
        gap: 2,
        alignItems: "flex-start",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {!summary && (
        <UploadModal
          setSummary={setSummary}
          setOriginalText={setOriginalText}
          theme={theme}
          setDocumentFile={setDocumentFile}
        />
      )}
      {summary && (
        <>
          <Box
            sx={{
              width: { xs: "100%", md: "30%" },
              marginBottom: { xs: 2, md: 0 },
              transition: "background-color 0.3s ease, color 0.3s ease",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                font: "inherit",
                fontWeight: "bold",
                fontSize: "20px",
                mb: 2,
                color: theme === "dark" ? "white" : "black",
              }}
            >
              Document Original
            </Typography>
            <Box
              sx={{
                border: "1px solid #f57c00",
                padding: 2,
                borderRadius: "12px",
                wordBreak: "break-word",
                overflowWrap: "break-word",
                overflowY: "auto",
              }}
            >
              {
                <>{
                  [0, 1, 2, 3, 4, 5].map((item) => (
                    <>
                                        <Typography
                    variant="subtitle1"
                    sx={{
                      font: "inherit",
                      color: theme === "dark" ? "white" : "black",
                    }}
                  >
                    Page {item}
                    {/* {originalText} */}
                  </Typography>
                      <img src={`page${item}.jpg`} width={400} />
                      </>
                  ))
                }

                </>
              }

            </Box>
          </Box>
          <Box
            sx={{
              width: { xs: "100%", md: "70%" },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                font: "inherit",
                fontWeight: "bold",
                fontSize: "20px",
                mb: 2,
                color: theme === "dark" ? "white" : "black",
              }}
            >
              Resumé
            </Typography>
            <Box
              sx={{
                border: "1px solid #f57c00",
                padding: 2,
                marginBottom: 2,
                borderRadius: "12px",
              }}
            >
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <Typography
                      variant="h4"
                      sx={{
                        font: "inherit",
                        color: theme === "dark" ? "white" : "black",
                        fontWeight: "bold",
                        mb: 2,
                      }}
                      {...props}
                    />
                  ),
                  h2: ({ node, ...props }) => (
                    <Typography
                      variant="h5"
                      sx={{
                        font: "inherit",
                        color: theme === "dark" ? "white" : "black",
                        fontWeight: "bold",
                        mb: 2,
                      }}
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <Typography
                      variant="h6"
                      sx={{
                        font: "inherit",
                        color: theme === "dark" ? "white" : "black",
                        fontWeight: "bold",
                      }}
                      {...props}
                    />
                  ),
                  p: ({ node, ...props }) => (
                    <Typography
                      sx={{
                        font: "inherit",
                        color: theme === "dark" ? "white" : "black",
                      }}
                      {...props}
                    />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul
                      style={{
                        color: theme === "dark" ? "white" : "black",
                        font: "inherit",
                      }}
                      {...props}
                    />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol
                      style={{
                        color: theme === "dark" ? "white" : "black",
                        font: "inherit",
                      }}
                      {...props}
                    />
                  ),
                }}
              >
                {summary}
              </ReactMarkdown>
            </Box>

            {/* Button section aligned in a row or column based on screen size */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                marginBottom: 2,
              }}
            >
              {/* <Button
                onClick={handleGenerateIdeas}
                sx={{
                  bgcolor: "#f57c00",
                  color: "white",
                  font: "inherit",
                  borderRadius: "12px",
                }}
                disabled={loadingKeyIdeas}
              >
                {loadingKeyIdeas ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Contract legality check"
                )}
              </Button>
              <Button
                onClick={handleGenerateDiscussionPoints}
                sx={{
                  bgcolor: "#f57c00",
                  color: "white",
                  font: "inherit",
                  borderRadius: "12px",
                }}
                disabled={loadingDiscussionPoints}
              >
                {loadingDiscussionPoints ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Generate Discussion Points"
                )}
              </Button> */}
              <ChatModal theme={theme} />
              {/* New Upload New Document Button */}
              <Button
                onClick={handleUploadNewDocument}
                sx={{
                  bgcolor: "#f57c00",
                  color: "white",
                  font: "inherit",
                  borderRadius: "12px",
                }}
              >
                Upload New Document
              </Button>
            </Box>
            {

            }

            {/* Display key ideas and discussion points as Markdown */}
            {(
              <Box sx={{ marginTop: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    font: "inherit",
                    fontWeight: "bold",
                    fontSize: "20px",
                    mb: 2,
                    color: theme === "dark" ? "white" : "black",
                  }}
                >
                  Conformité de Contrat
                </Typography>
                <Box
                  sx={{
                    border: "1px solid #f57c00",
                    padding: 2,
                    borderRadius: "12px",
                  }}
                >
                  {/* Custom ReactMarkdown renderer */}
                  {
                    mock.map((article) => (<ArticleCard article={article} />))
                  }
                  {/* <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => (
                        <Typography
                          variant="h4"
                          sx={{
                            font: "inherit",
                            color: theme === "dark" ? "white" : "black",
                            fontWeight: "bold",
                            mb: 2,
                          }}
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <Typography
                          variant="h5"
                          sx={{
                            font: "inherit",
                            color: theme === "dark" ? "white" : "black",
                            fontWeight: "bold",
                            mb: 2,
                          }}
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <Typography
                          variant="h6"
                          sx={{
                            font: "inherit",
                            color: theme === "dark" ? "white" : "black",
                            fontWeight: "bold",
                          }}
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <Typography
                          sx={{
                            font: "inherit",
                            color: theme === "dark" ? "white" : "black",
                          }}
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          style={{
                            color: theme === "dark" ? "white" : "black",
                            font: "inherit",
                          }}
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          style={{
                            color: theme === "dark" ? "white" : "black",
                            font: "inherit",
                          }}
                          {...props}
                        />
                      ),
                    }}
                  >
                    {keyIdeas}
                  </ReactMarkdown> */}
                </Box>
              </Box>
            )}
            {discussionPoints && (
              <Box sx={{ marginTop: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    font: "inherit",
                    fontWeight: "bold",
                    fontSize: "20px",
                    mb: 2,
                    color: theme === "dark" ? "white" : "black", // Set text color based on theme
                  }}
                >
                  Discussion Points
                </Typography>
                <Box
                  sx={{
                    border: "1px solid #f57c00",
                    padding: 2,
                    borderRadius: "12px",
                  }}
                >
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => (
                        <Typography
                          variant="h4"
                          sx={{
                            font: "inherit",
                            color: theme === "dark" ? "white" : "black",
                            fontWeight: "bold",
                            mb: 2,
                          }}
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <Typography
                          variant="h5"
                          sx={{
                            font: "inherit",
                            color: theme === "dark" ? "white" : "black",
                            fontWeight: "bold",
                            mb: 2,
                          }}
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <Typography
                          variant="h6"
                          sx={{
                            font: "inherit",
                            color: theme === "dark" ? "white" : "black",
                            fontWeight: "bold",
                          }}
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <Typography
                          sx={{
                            font: "inherit",
                            color: theme === "dark" ? "white" : "black",
                          }}
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          style={{
                            color: theme === "dark" ? "white" : "black",
                            font: "inherit",
                          }}
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          style={{
                            color: theme === "dark" ? "white" : "black",
                            font: "inherit",
                          }}
                          {...props}
                        />
                      ),
                    }}
                  >
                    {discussionPoints}
                  </ReactMarkdown>
                </Box>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Home;
