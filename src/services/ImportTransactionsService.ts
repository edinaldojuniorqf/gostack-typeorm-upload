import fs from 'fs';
import csv from 'csv-parse';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  path: string;
}

class ImportTransactionsService {
  async execute({ path }: Request): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const transactions: Array<Transaction> = [];

    const csvCustom = csv({ from_line: 2 });

    const csvPipe = fs.createReadStream(path).pipe(csvCustom);

    csvPipe.on('data', async data => {
      const [title, type, value, category] = data.map((item: string) =>
        item.trim(),
      );

      const transactionCategory = new Category();
      transactionCategory.title = category;

      const transaction = new Transaction();
      transaction.title = title;
      transaction.type = type;
      transaction.value = Number(value);
      transaction.category = transactionCategory;

      transactions.push(transaction);
    });

    await new Promise(resolve => csvPipe.on('end', () => resolve()));

    // eslint-disable-next-line no-restricted-syntax
    for (const transaction of transactions) {
      const { title, value, type, category } = transaction;
      // eslint-disable-next-line no-await-in-loop
      await createTransaction.execute({
        title,
        value,
        type,
        category: category.title,
      });
    }

    return transactions;
  }
}

export default ImportTransactionsService;
