using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SimchaFund.Data
{
    public class ActioningOne
    {
        public int Id { get; set; }
        public int ContributorId { get; set; }
        public string Name { get; set; }
        public int SimchaId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }

        public override string ToString()
        {
            return $"{Id} {ContributorId} {Name} {Amount} {Date}";
        }
    }
}
