import coreJoi from "joi";
import joiDate from "@joi/date";
const joi = coreJoi.extend(joiDate);

export const customerSchema= joi.object({
  name: joi.string().required(),
  phone: joi.string().required().regex(new RegExp('^[0-9]+$')).min(10).max(11),
  cpf: joi.string().required().length(11).regex(new RegExp('^[0-9]+$')),
  //birthday: joi.string().required()
  birthday: joi.date().format('YYYY-MM-DD').required()
});