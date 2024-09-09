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
            SimchosDataContext context = new SimchosDataContext(_connectionString);
            return context.Contributors.OrderByDescending(c => c.DateCreated).ToList();
        }

        public int Add(Contributor c)
        {
            SimchosDataContext context = new SimchosDataContext(_connectionString);
            context.Contributors.Add(c);
            context.SaveChanges();
            return c.Id;
        }

        public void Update(Contributor c)
        {
            SimchosDataContext context = new SimchosDataContext(_connectionString);
            context.Contributors.Update(c);
            context.SaveChanges();
        }

        public Contributor GetById(int id)
        {
            SimchosDataContext context = new SimchosDataContext(_connectionString);
            return context.Contributors.FirstOrDefault(c => c.Id == id);
        }

        public void AddAction(OneAction a)
        {
            SimchosDataContext context = new SimchosDataContext(_connectionString);
            context.Actions.Add(a);
            context.SaveChanges();
        }

        public List<OneAction> GetAllActionsForUser(int id)
        {
            SimchosDataContext context = new SimchosDataContext(_connectionString);
            return context.Actions.Where(a => a.ContributorId == id).ToList();
        }

        public double GetBalance(int id)
        {
            SimchosDataContext context = new SimchosDataContext(_connectionString);
            return context.Actions.Where(a => a.ContributorId == id).Select(a => a.Amount).ToList().Sum();
        }
    }
}
