import SignatureMasterService from './signature_master.service.js';
import { statusCode } from '../../../utils/constants/statusCode.js';

export default class SignatureMasterController {
  constructor() {
    this.signatureMasterService = SignatureMasterService;
  }

  getAll = async (req, res, next) => {
    try {
      await this.signatureMasterService.seedIfEmpty();
      const signatures = await this.signatureMasterService.getAll();
      res.status(statusCode.OK).json({
        success: true,
        message: 'Get All Signatures',
        data: signatures
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { SignatureOtherTitle, status } = req.body;

    const signature = await this.signatureMasterService.getById(id);
    if (!signature) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: 'Signature not found'
      });
    }

    const updateData = {};
    if (SignatureOtherTitle !== undefined) updateData.SignatureOtherTitle = SignatureOtherTitle;
    if (status !== undefined) updateData.status = status;

    const updated = await this.signatureMasterService.update(id, updateData);

    res.status(statusCode.OK).json({
      success: true,
      message: 'Signature updated successfully',
      data: updated
    });
  } catch (err) {
    next(err);
  }
};

create = async (req, res, next) => {
  try {
    const { signatureTitle, SignatureOtherTitle, status } = req.body;

    if (!signatureTitle) {
      return res.status(statusCode.BAD_REQUEST).json({
        success: false,
        message: 'signatureTitle is required'
      });
    }

    const newSignature = await this.signatureMasterService.create({
      signatureTitle,
      SignatureOtherTitle,
      status: status 
    });

    res.status(statusCode.CREATED).json({
      success: true,
      message: 'Signature created successfully',
      data: newSignature
    });
  } catch (err) {
    next(err);
  }
};

delete = async (req, res, next) => {
  try {
    const { id } = req.params;

    const signature = await this.signatureMasterService.getById(id);
    if (!signature) {
      return res.status(statusCode.NOT_FOUND).json({
        success: false,
        message: 'Signature not found'
      });
    }

    await this.signatureMasterService.delete(id);

    res.status(statusCode.OK).json({
      success: true,
      message: 'Signature deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};


}
