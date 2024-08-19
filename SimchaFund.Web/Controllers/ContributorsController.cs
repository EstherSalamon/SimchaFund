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
            List<Contributor> allOfThem = repo.GetAll();
            List<GetGuyAndBalance> toPassIn = new List<GetGuyAndBalance>();
            foreach(Contributor guy in allOfThem)
            {
                GetGuyAndBalance newOne = new GetGuyAndBalance
                {
                    Id = guy.Id,
                    FirstName = guy.FirstName,
                    LastName = guy.LastName,
                    PhoneNumber = guy.PhoneNumber,
                    AlwaysInclude = guy.AlwaysInclude,
                    DateCreated = guy.DateCreated,
                    Balance = repo.GetBalance(guy.Id)
                };

                toPassIn.Add(newOne);
            }

            GetContributorsVM vm = new GetContributorsVM
            {
                Contributors = toPassIn,
                Total = toPassIn.Select(t => t.Balance).Sum()
            };

            return vm;
        }

        [HttpPost("add")]
        public void Add(ContributorVM vm)
        {
            ContributorRepository repo = new ContributorRepository(_connectionString);
            int id = repo.Add(vm.Contributor);
            ActioningOne action = new ActioningOne
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
