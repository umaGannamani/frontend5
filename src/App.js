// src/App.js
import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      type: 'Credit',
      amount: '',
      description: '',
      date: ''
    };
  }

  componentDidMount() {
    axios.get('http://localhost:3001/api/transactions')
      .then(response => {
        this.setState({ transactions: response.data });
      });
  }

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleAddTransaction = (event) => {
    event.preventDefault();
    const { type, amount, description, date } = this.state;
    axios.post('http://localhost:3001/api/transactions', {
      type,
      amount,
      description,
      date
    }).then(() => {
      this.setState(prevState => ({
        transactions: [...prevState.transactions, { type, amount, description, date }],
        type: 'Credit',
        amount: '',
        description: '',
        date: ''
      }));
    });
  }

  render() {
    const { transactions, type, amount, description, date } = this.state;
    return (
      <div>
        <h1>Office Transactions</h1>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Credit</th>
              <th>Debit</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => {
              const balance = transactions.slice(0, index + 1).reduce((acc, trans) => {
                return trans.type === 'Credit' ? acc + parseFloat(trans.amount) : acc - parseFloat(trans.amount);
              }, 0);
              return (
                <tr key={index}>
                  <td>{transaction.date}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.type === 'Credit' ? transaction.amount : ''}</td>
                  <td>{transaction.type === 'Debit' ? transaction.amount : ''}</td>
                  <td>{balance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2>Add Transaction</h2>
        <form onSubmit={this.handleAddTransaction}>
          <div>
            <label>Type:</label>
            <select name="type" value={type} onChange={this.handleChange}>
              <option value="Credit">Credit</option>
              <option value="Debit">Debit</option>
            </select>
          </div>
          <div>
            <label>Amount:</label>
            <input type="number" name="amount" value={amount} onChange={this.handleChange} required />
          </div>
          <div>
            <label>Description:</label>
            <input type="text" name="description" value={description} onChange={this.handleChange} required />
          </div>
          <div>
            <label>Date:</label>
            <input type="date" name="date" value={date} onChange={this.handleChange} required />
          </div>
          <button type="submit">Save</button>
        </form>
      </div>
    );
  }
}

export default App;
