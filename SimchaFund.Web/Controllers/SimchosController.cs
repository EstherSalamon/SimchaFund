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
        public void Update(UpdateActionsVM vm)
        {
            SimchaRepository repo = new SimchaRepository(_connectionString);
            repo.Update(vm.Actions, vm.SimchaId);
        }

        [HttpGet("actionsbyid")]
        public List<ActioningOne> GetAllActions(int id)
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
            List<ActioningOne> didContribute = sRepo.GetAllActionById(id);

            foreach(var c in didContribute)
            {
                Console.WriteLine($"{c.Id} {c.Name} {c.Date} {c.ContributorId} {c.SimchaId} {c.Amount}");
            }

            List<Contributor> allPeople = cRepo.GetAll();
            List<GetGuyAndBalance> contributors = Convert(allPeople);
            List<UpdateVM> iDidYourWorkAlready = new List<UpdateVM>();

            foreach (var c in contributors)
            {
                ActioningOne one = didContribute.FirstOrDefault(d => d.ContributorId == c.Id);

                UpdateVM vm = new UpdateVM
                {
                    ControId = c.Id,
                    SimchaId = id,
                    AlwaysInclude = c.AlwaysInclude,
                    Name = $"{c.FirstName} {c.LastName}",
                    Balance = c.Balance,
                    Contribute = (one != null || c.AlwaysInclude),
                };

                if(one == null)
                {
                    vm.Amount = 5;
                }
                else
                {
                    vm.Amount = one.Amount * -1;
                }

                iDidYourWorkAlready.Add(vm);
            }

            return iDidYourWorkAlready;

            //EverythingBagel round = new EverythingBagel
            //{
            //    Contributors = iDidYourWorkAlready,
            //    Simcha = sRepo.GetById(id)
            //};

            //Console.WriteLine(round.Simcha);

            //return round;
        }

        public List<GetGuyAndBalance> Convert(List<Contributor> contributors)
        {
            List<GetGuyAndBalance> toPassIn = new List<GetGuyAndBalance>();
            ContributorRepository repo = new ContributorRepository(_connectionString);

            foreach (Contributor guy in contributors)
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

            return toPassIn;
        }
    }
}
