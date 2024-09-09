using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SimchaFund.Data;
using SimchaFund.Web.Views;
using System.Text.Json;

namespace SimchaFund.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SimchosController : ControllerBase
    {
        private readonly string _connectionString;

        public SimchosController(IConfiguration config)
        {
            _connectionString = config.GetConnectionString("ConStr");
        }

        [HttpGet("get")]
        public GetSimchosVM GetAll()
        {
            SimchaRepository repo = new SimchaRepository(_connectionString);
            ContributorRepository cRepo = new ContributorRepository(_connectionString);
            List<Contributor> contributors = cRepo.GetAll();
            List<Simcha> simchas = repo.GetAll();

            List<GetSimchos> mergedSimchos = new List<GetSimchos>();

            foreach (Simcha s in simchas)
            {
                List<OneAction> actions = repo.GetAllActionById(s.Id).ToList();

                GetSimchos simcha = new GetSimchos
                {
                    Id = s.Id,
                    Name = s.Name,
                    Date = s.Date,
                    Contributors = actions.Count,
                    TotalCollected = actions.Select(a => a.Amount).Sum()
                };

                mergedSimchos.Add(simcha);
            }

            GetSimchosVM vm = new GetSimchosVM
            {
                Simchos = mergedSimchos,
                TotalContributors = contributors.Count
            };

            return vm;
        }

        [HttpPost("add")]
        public void Add(SimchaVM vm)
        {
            SimchaRepository repo = new SimchaRepository(_connectionString);
            repo.Add(vm.Simcha);
        }

        [HttpPost("update")]
        public void Update(UpdateActionsVM vm)
        {
            SimchaRepository repo = new SimchaRepository(_connectionString);
            repo.Update(vm.Actions, vm.SimchaId);
        }

        [HttpGet("actionsbyid")]
        public List<OneAction> GetAllActions(int id)
        {
            SimchaRepository repo = new SimchaRepository(_connectionString);
            return repo.GetAllActionById(id);
        }

        [HttpGet("byid")]
        public Simcha GetById(int id)
        {
            SimchaRepository repo = new SimchaRepository(_connectionString);
            return repo.GetById(id);
        }

        [HttpGet("everything")]
        public List<UpdateVM> GetEverything(int id)
        {
            SimchaRepository sRepo = new SimchaRepository(_connectionString);
            ContributorRepository cRepo = new ContributorRepository(_connectionString);
            List<OneAction> didContribute = sRepo.GetAllActionById(id);

            List<Contributor> contributors = cRepo.GetAll();
            foreach (var c in contributors)
            {
                c.Balance = cRepo.GetBalance(c.Id);
            }
            List<UpdateVM> combineAllData = new List<UpdateVM>();

            foreach (var c in contributors)
            {
                OneAction action = didContribute.FirstOrDefault(d => d.ContributorId == c.Id);

                UpdateVM vm = new UpdateVM
                {
                    ControId = c.Id,
                    SimchaId = id,
                    AlwaysInclude = c.AlwaysInclude,
                    Name = $"{c.FirstName} {c.LastName}",
                    Balance = c.Balance,
                    Contribute = (action != null || c.AlwaysInclude),
                };

                if (action == null)
                {
                    vm.Amount = 5;
                }
                else
                {
                    vm.Amount = action.Amount;
                }

                combineAllData.Add(vm);
            }

            return combineAllData;
        }
    }
}
