using SimchaFund.Data;

namespace SimchaFund.Web.Views
{
    public class UpdateVM
    {
        public int ControId { get; set; }
        public int SimchaId { get; set; }
        public string Name { get; set; }
        public double Balance { get; set; }
        public bool AlwaysInclude { get; set; }
        public bool Contribute { get; set; }
        public double Amount { get; set; }
    }
}
