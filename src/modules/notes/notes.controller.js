import NotesService from './notes.service.js';
import { statusCode } from '../../utils/constants/statusCode.js';

export default class NotesController {
  constructor() {
    this.notesService = NotesService;
  }

  addNotes = async (req, res, next) => {
    try {
      const { patientId, admissionId, clinicalNotes, nursingNotes, surgicalNotes, symptoms, pastHistory, vitalData } = req.body;

      if (!patientId || !admissionId) {
        return res.status(statusCode.BAD_REQUEST).json({
          success: false,
          message: 'patientId and admissionId are required'
        });
      }

      const result = await NotesService.addNotes({
        patientId,
        admissionId,
        notes: { clinicalNotes, nursingNotes, surgicalNotes, symptoms, pastHistory, vitalData },
        user: req.user
      });

      res.status(statusCode.OK).json({
        success: true,
        message: result.message,
        data: result.data   
      });

    } catch (err) {
      next(err);
    }
  }

  getNotes = async (req, res, next) => {
    try {
      const { patientId, admissionId } = req.params;
      const data = await this.notesService.getNotes(patientId, admissionId);
      res.status(statusCode.OK).json({ success: true, message: `Notes for patient ${patientId}, admission ${admissionId} fetched`, data });
    } catch (err) {
      next(err);
    }
  };

  updateNote = async (req, res, next) => {
    try {
      const { patientId, admissionId, field, noteId, newNote } = req.body;
      if (!patientId || !admissionId || !field || !noteId || !newNote) {
        return res.status(statusCode.BAD_REQUEST).json({ success: false, message: 'All fields are required' });
      }

      const result = await this.notesService.updateSpecificNote({ patientId, admissionId, field, noteId, newNote, user: req.user });
      res.status(statusCode.OK).json({ success: true, message: result.message, data: result.updatedNote });
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
}
