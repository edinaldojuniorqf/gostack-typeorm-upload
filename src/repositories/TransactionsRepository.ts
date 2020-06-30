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
    let { sum: income } = await this.createQueryBuilder('transactions')
      .select('SUM(value)', 'sum')
      .where('transactions.type = :type', { type: 'income' })
      .getRawOne();

    let { sum: outcome } = await this.createQueryBuilder('transactions')
      .select('SUM(value)', 'sum')
      .where('transactions.type = :type', { type: 'outcome' })
      .getRawOne();

    income = Number(income);
    outcome = Number(outcome);

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
