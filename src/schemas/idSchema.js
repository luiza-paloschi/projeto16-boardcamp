import joi from 'joi'

export const idSchema= joi.object({
    numberId: joi.number().positive().integer().required()
  })