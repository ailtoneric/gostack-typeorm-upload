import { getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_id: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_id,
  }: Request): Promise<Transaction> {
    const transactionRepository = getRepository(Transaction);

    const typeIsValid = ['income', 'outcome'].includes(type);

    if (!typeIsValid) {
      throw new AppError('Type is not valid');
    }

    let categoryId: string;

    const categoryRepository = getRepository(Category);

    const categoryExists = await categoryRepository.findOne({
      where: { title: category_id },
    });

    if (!categoryExists) {
      const category = categoryRepository.create({
        title: category_id,
      });

      await categoryRepository.save(category);

      categoryId = category.id;
    } else {
      categoryId = categoryExists.id;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      categoryId,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
