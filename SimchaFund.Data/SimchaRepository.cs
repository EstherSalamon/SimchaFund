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
            OfSimchosDataContext context = new OfSimchosDataContext(_connectionString);
            return context.Simchos.ToList();
        }

        public void Add(Simcha s)
        {
            OfSimchosDataContext context = new OfSimchosDataContext(_connectionString);
            context.Simchos.Add(s);
            context.SaveChanges();
        }

        public void Update(List<ActioningOne> actions, int simchaId)
        {
            OfSimchosDataContext context = new OfSimchosDataContext(_connectionString);
            context.Database.ExecuteSqlInterpolated($"DELETE FROM ActioningOnes WHERE SimchaId = {simchaId}");
            foreach(var c in actions)
            {
                c.Date = DateTime.Now;
                context.ActioningOnes.Add(c);
            }
            context.SaveChanges();
        }

        public List<ActioningOne> GetAllActionById(int id)
        {
            OfSimchosDataContext context = new OfSimchosDataContext(_connectionString);
            return context.ActioningOnes.Where(a => a.SimchaId == id).ToList();
        }

        public Simcha GetById(int id)
        {
            OfSimchosDataContext context = new OfSimchosDataContext(_connectionString);
            return context.Simchos.FirstOrDefault(s => s.Id == id);
        }
    }
}
