import NotesService from './notes.service.js';
import { statusCode } from '../../utils/constants/statusCode.js';

export default class NotesController {
  constructor() {
    this.notesService = NotesService;
  }

//   addNotes = async (req, res, next) => {
//   try {
//     const { patientId, admissionId, clinicalNotes, nursingNotes, surgicalNotes, symptoms, pastHistory, vitalData, otherData } = req.body;

//     if (!patientId || !admissionId) {
//       return res.status(400).json({ success: false, message: 'patientId and admissionId are required' });
//     }

//     const notes = { clinicalNotes, nursingNotes, surgicalNotes, symptoms, pastHistory, vitalData, otherData };

//     const result = await this.notesService.addNotes({
//       patientId,
//       admissionId,
//       notes,
//       user: req.user,
//       files: req.files  
//     });

//     res.status(200).json({ success: true, message: result.message, data: result.data });
//   } catch (err) {
//     next(err);
//   }
// };
addNotes = async (req, res, next) => {
    try {
      const { patientId, admissionId, clinicalNotes, nursingNotes, surgicalNotes, symptoms, pastHistory, vitalData, otherData } = req.body;

      if (!patientId || !admissionId) {
        return res.status(400).json({ success: false, message: 'patientId and admissionId are required' });
      }

      const notes = { clinicalNotes, nursingNotes, surgicalNotes, symptoms, pastHistory, vitalData, otherData };

      const result = await this.notesService.addNotes({
        patientId,
        admissionId,
        notes,
        user: req.user,
        files: req.files
      });

      res.status(200).json({ success: true, message: result.message, data: result.data });
    } catch (err) {
      next(err);
    }
  };

  getNotes = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;
      const data = await this.notesService.getNotes(patientId, admissionId);
      res.status(statusCode.OK).json({ success: true, message: `Notes for patient ${patientId}, admission ${admissionId} fetched`, data });
    } catch (err) {
      next(err);
    }
  };

// updateNote = async (req, res, next) => {
//   try {
//     const { patientId, admissionId, noteId, newNote, pdfId } = req.body;

//     if (!patientId || !admissionId || !noteId) {
//       return res.status(400).json({ success: false, message: 'patientId, admissionId, and noteId are required' });
//     }

//     let pdfFile;
//     if (req.files?.clinicalNotesPdf) pdfFile = req.files.clinicalNotesPdf[0];
//     else if (req.files?.nursingNotesPdf) pdfFile = req.files.nursingNotesPdf[0];
//     else if (req.files?.surgicalNotesPdf) pdfFile = req.files.surgicalNotesPdf[0];
//     else if (req.files?.symptomsPdf) pdfFile = req.files.symptomsPdf[0];
//     else if (req.files?.pastHistoryPdf) pdfFile = req.files.pastHistoryPdf[0]; 
//     else if (req.files?.vitalDataPdf) pdfFile = req.files.vitalDataPdf[0];
//     else if (req.files?.otherDataPdf) pdfFile = req.files.otherDataPdf[0];

//     const result = await this.notesService.updateSpecificNote({
//       patientId,
//       admissionId,
//       noteId,
//       newNote,
//       pdfFile,  
//       pdfId,
//       user: req.user
//     });

//     res.status(200).json({ success: true, message: result.message, data: result.updatedNote });
//   } catch (err) {
//     next(err);
//   }
// };
updateNote = async (req, res, next) => {
    try {
      const { patientId, admissionId, noteGroupId, noteId, newText } = req.body;

      if (!patientId || !admissionId || !noteGroupId) {
        return res.status(400).json({ success: false, message: 'patientId, admissionId, and noteGroupId are required' });
      }

      let pdfFile;
      if (req.files?.clinicalNotesPdf) pdfFile = req.files.clinicalNotesPdf[0];
      else if (req.files?.nursingNotesPdf) pdfFile = req.files.nursingNotesPdf[0];
      else if (req.files?.surgicalNotesPdf) pdfFile = req.files.surgicalNotesPdf[0];
      else if (req.files?.symptomsPdf) pdfFile = req.files.symptomsPdf[0];
      else if (req.files?.pastHistoryPdf) pdfFile = req.files.pastHistoryPdf[0];
      else if (req.files?.vitalDataPdf) pdfFile = req.files.vitalDataPdf[0];
      else if (req.files?.otherDataPdf) pdfFile = req.files.otherDataPdf[0];

      const result = await this.notesService.updateSpecificNote({
        patientId,
        admissionId,
        noteGroupId,
        noteId,
        newText,
        pdfFile,
        user: req.user
      });

      res.status(200).json({ success: true, message: result.message, data: result.updatedNote });
    } catch (err) {
      next(err);
    }
  };

  deleteNote = async (req, res, next) => {
    try {
      const { patientId, admissionId, field, noteId } = req.body;
      if (!patientId || !admissionId || !field || !noteId) {
        return res.status(statusCode.BAD_REQUEST).json({ success: false, message: 'All fields are required' });
      }

      const result = await this.notesService.deleteNote({ patientId, admissionId, field, noteId });
      res.status(statusCode.OK).json({ success: true, message: result.message, data: { noteId } });
    } catch (err) {
      next(err);
    }
  };

    getClinicalNotes = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;
      const data = await this.notesService.getSpecificNotes(patientId, admissionId, "clinicalNotes");
      res.status(statusCode.OK).json({ success: true, message: "Fetched clinical notes", data });
    } catch (err) {
      next(err);
    }
  };

  getNursingNotes = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;
      const data = await this.notesService.getSpecificNotes(patientId, admissionId, "nursingNotes");
      res.status(statusCode.OK).json({ success: true, message: "Fetched nursing notes", data });
    } catch (err) {
      next(err);
    }
  };

  getSurgicalNotes = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;
      const data = await this.notesService.getSpecificNotes(patientId, admissionId, "surgicalNotes");
      res.status(statusCode.OK).json({ success: true, message: "Fetched surgical notes", data });
    } catch (err) {
      next(err);
    }
  };

  getSymptoms = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;
      const data = await this.notesService.getSpecificNotes(patientId, admissionId, "symptoms");
      res.status(statusCode.OK).json({ success: true, message: "Fetched symptoms", data });
    } catch (err) {
      next(err);
    }
  };

  getPastHistory = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;
      const data = await this.notesService.getSpecificNotes(patientId, admissionId, "pastHistory");
      res.status(statusCode.OK).json({ success: true, message: "Fetched past history", data });
    } catch (err) {
      next(err);
    }
  };

  getVitalData = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;
      const data = await this.notesService.getSpecificNotes(patientId, admissionId, "vitalData");
      res.status(statusCode.OK).json({ success: true, message: "Fetched vital data", data });
    } catch (err) {
      next(err);
    }
  };

  getOtherData = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;
      const data = await this.notesService.getSpecificNotes(patientId, admissionId, "otherData");
      res.status(statusCode.OK).json({ success: true, message: "Fetched other data", data });
    } catch (err) {
      next(err);
    }
  };

}
