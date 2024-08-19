using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimchaFund.Data
{
    public class ContributorRepository
    {
        private readonly string _connectionString;

        public ContributorRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public List<Contributor> GetAll()
        {
            OfSimchosDataContext context = new OfSimchosDataContext(_connectionString);
            return context.Contributors.OrderByDescending(c => c.DateCreated).ToList();
        }

        public int Add(Contributor c)
        {
            OfSimchosDataContext context = new OfSimchosDataContext(_connectionString);
            context.Contributors.Add(c);
            context.SaveChanges();
            return c.Id;
        }

        public void Update(Contributor c)
        {
            OfSimchosDataContext context = new OfSimchosDataContext(_connectionString);
            context.Contributors.Update(c);
            context.SaveChanges();
        }

        public Contributor GetById(int id)
        {
            OfSimchosDataContext context = new OfSimchosDataContext(_connectionString);
            return context.Contributors.FirstOrDefault(c => c.Id == id);
        }

        public void AddAction(ActioningOne a)
        {
            OfSimchosDataContext context = new OfSimchosDataContext(_connectionString);
            context.Actions.Add(a);
            context.SaveChanges();
        }

        public List<ActioningOne> GetAllActionsForUser(int id)
        {
            OfSimchosDataContext context = new OfSimchosDataContext(_connectionString);
            return context.Actions.Where(a => a.ContributorId == id).ToList();
        }

        public decimal GetBalance(int id)
        {
            OfSimchosDataContext context = new OfSimchosDataContext(_connectionString);
            return context.Actions.Where(a => a.ContributorId == id).Select(a => a.Amount).ToList().Sum();
        }
    }
}
