/**
 * Interface for the Resume data model.
 * Matches the backend `Resume` entity.
 */
export interface Resume {
  id: string; // Unique identifier for the resume
  content: string; // Extracted text content of the resume
  fileName: string; // Original name of the uploaded file
  contentType: string; // MIME type of the file
  fileSize: number; // Size of the file in bytes
  uploadDate: string; // Date/time of upload (as string from backend)
}

/**
 * Interface for the JobDescription data model.
 * Matches the backend `JobDescription` entity/DTO.
 */
export interface JobDescription {
  id: string; // Unique identifier for the job description
  title: string; // Job title
  description: string; // Full job description text
  requiredSkills: string; // Comma-separated required skills
  preferredSkills: string; // Comma-separated preferred skills
  experienceLevel: string; // Required experience level
}

/**
 * Interface for the detailed analysis response from the backend.
 * Matches backend `AnalysisResponse` DTO.
 */
export interface AnalysisResponse {
  matchScore: number; // Numerical score of resume-JD match
  strengths: string; // Textual summary of resume strengths
  weaknesses: string; // Textual summary of resume weaknesses
  recommendations: string; // Actionable advice for improvement
  resumeSkills?: string[]; // Optional: List of skills found in resume
  jobDescriptionSkills?: string[]; // Optional: List of skills from job description
}

/**
 * Interface for a historical analysis result stored in the backend.
 * Matches backend `AnalysisResult` entity/`AnalysisResultResponse` DTO for dashboard.
 */
export interface AnalysisResult {
  id: string; // Unique ID of the analysis record
  jobTitle: string; // Job title of the analyzed pair
  company: string; // Company name for the job
  matchScore: number; // Match score for this historical entry
  date: string; // Date/time the analysis was performed (as string)
}

/**
 * Interface for the response received after a resume upload.
 * Matches backend `ResumeUploadResponse` DTO.
 */
export interface ResumeUploadResponse {
  id: string; // ID of the newly uploaded resume
  message: string; // Status message from upload
  uploadDate: string; // Date/time of successful upload (as string)
}

/**
 * DTO for sending analysis request to the backend.
 * Matches backend `AnalysisRequest` DTO.
 */
export interface AnalysisRequestPayload {
  resumeId: string; // ID of the resume to analyze
  jobDescriptionId: string; // ID of the job description to analyze against
}