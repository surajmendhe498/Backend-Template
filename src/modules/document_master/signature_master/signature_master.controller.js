import SignatureMasterService from './signature_master.service.js';
import { statusCode } from '../../../utils/constants/statusCode.js';

export default class SignatureMasterController {
  constructor() {
    this.signatureMasterService = SignatureMasterService;
  }

  getAll = async (req, res, next) => {
    try {
      const signatures = await this.signatureMasterService.getAll();
      res.status(statusCode.OK).json({ message: 'Get All Signatures', data: signatures });
    } catch (err) {
      next(err);
    }
  };

  create = async (req, res, next) => {
    try {
      const newSignature = await this.signatureMasterService.create(req.body);
      res.status(statusCode.CREATED).json({ message: 'Signature Created', data: newSignature });
    } catch (err) {
      next(err);
    }
  };

  search = async (req, res, next) => {
    try {
      const results = await this.signatureMasterService.search(req.query);
      res.status(statusCode.OK).json({ message: 'Search Results', data: results });
    } catch (err) {
      next(err);
    }
  };
}
