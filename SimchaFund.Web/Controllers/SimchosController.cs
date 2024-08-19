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

            List<GetSimchos> allMerged = new List<GetSimchos>();

            foreach(Simcha s in simchas)
            {
                List<ActioningOne> actions = repo.GetAllActionById(s.Id).ToList();

                GetSimchos thisOne = new GetSimchos
                {
                    Id = s.Id,
                    Name = s.Name,
                    Date = s.Date,
                    Contributors = actions.Count,
                    TotalCollected = actions.Select(a => a.Amount).Sum()
                };

                allMerged.Add(thisOne);
            }

            GetSimchosVM vm = new GetSimchosVM
            {
                Simchos = allMerged,
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
        public void Update(SimchaVM vm)
        {
            SimchaRepository repo = new SimchaRepository(_connectionString);
            repo.Update(vm.Simcha);
        }

        [HttpGet("actionsbyid")]
        public List<ActioningOne> GetAllActions(int id)
        {
            SimchaRepository repo = new SimchaRepository(_connectionString);
            return repo.GetAllActionById(id).ToList();
        }

        [HttpGet("byid")]
        public Simcha GetById(int id)
        {
            SimchaRepository repo = new SimchaRepository(_connectionString);
            return repo.GetById(id);
        }
    }
}
