using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimchaFund.Data
{
    public class SimchaRepository
    {
        private readonly string _connectionString;

        public SimchaRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public List<Simcha> GetAll()
        {
            SimchosDataContext context = new SimchosDataContext(_connectionString);
            return context.Simchos.ToList();
        }

        public void Add(Simcha s)
        {
            SimchosDataContext context = new SimchosDataContext(_connectionString);
            context.Simchos.Add(s);
            context.SaveChanges();
        }

        public void Update(List<OneAction> actions, int simchaId)
        {
            SimchosDataContext context = new SimchosDataContext(_connectionString);
            context.Database.ExecuteSqlInterpolated($"DELETE FROM Actions WHERE SimchaId = {simchaId}");
            foreach(var c in actions)
            {
                c.Date = DateTime.Now;
                context.Actions.Add(c);
            }
            context.SaveChanges();
        }

        public List<OneAction> GetAllActionById(int id)
        {
            SimchosDataContext context = new SimchosDataContext(_connectionString);
            return context.Actions.Where(a => a.SimchaId == id).ToList();
        }

        public Simcha GetById(int id)
        {
            SimchosDataContext context = new SimchosDataContext(_connectionString);
            return context.Simchos.FirstOrDefault(s => s.Id == id);
        }
    }
}
