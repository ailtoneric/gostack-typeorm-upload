import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const initialValue = 0;

    const transactions = await this.find();

    const income = transactions.reduce(
      (total: number, transaction: Transaction) =>
        total + (transaction.type === 'income' ? Number(transaction.value) : 0),
      initialValue,
    );

    const outcome = transactions.reduce(
      (total: number, transaction: Transaction) =>
        total +
        (transaction.type === 'outcome' ? Number(transaction.value) : 0),
      initialValue,
    );

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
