using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using SimchaFund.Data;
using SimchaFund.Web.Views;

namespace SimchaFund.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContributorsController : ControllerBase
    {
        private readonly string _connectionString;

        public ContributorsController(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("ConStr");
        }

        [HttpGet("get")]
        public GetContributorsVM GetAll()
        {
            ContributorRepository repo = new ContributorRepository(_connectionString);
            List<Contributor> contributors = repo.GetAll();
            foreach(var c in contributors)
            {
                c.Balance = repo.GetBalance(c.Id);
            }

            GetContributorsVM vm = new GetContributorsVM
            {
                Contributors = contributors,
                Total = contributors.Select(t => t.Balance).Sum()
            };

            return vm;
        }

        [HttpPost("add")]
        public void Add(ContributorVM vm)
        {
            ContributorRepository repo = new ContributorRepository(_connectionString);
            int id = repo.Add(vm.Contributor);
            OneAction action = new OneAction
            {
                Name = "Deposit",
                ContributorId = id,
                Date = vm.Contributor.DateCreated,
                Amount = vm.InitialDeposit
            };
            repo.AddAction(action);
        }

        [HttpPost("update")]
        public void Update(ContributorVM vm)
        {
            ContributorRepository repo = new ContributorRepository(_connectionString);
            repo.Update(vm.Contributor);
        }

        [HttpGet("byid")]
        public Contributor GetById(int id)
        {
            ContributorRepository repo = new ContributorRepository(_connectionString);
            return repo.GetById(id);
        }

        [HttpPost("addaction")]
        public void AddAction(AddActionVM vm)
        {
            ContributorRepository repo = new ContributorRepository(_connectionString);
            repo.AddAction(vm.Action);
        }

        [HttpGet("history")]
        public HistoryVM GetHistoryForUser(int userId)
        {
            ContributorRepository repo = new ContributorRepository(_connectionString);
            HistoryVM vm = new HistoryVM
            {
                AllActions = repo.GetAllActionsForUser(userId),
                Contributor = repo.GetById(userId)
            };
            return vm;

        }
    }
}
