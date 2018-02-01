using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DutchTreat.Data;
namespace DutchTreat.Controllers
{
    public class AppController : Controller
    {
        private readonly DutchContext _context;
        public AppController(DutchContext context){
            _context = context;
        }
        public IActionResult Index(){
            return View();
        }

        public IActionResult Shop(){
            // var result = _context.Products.OrderBy(p=>p.Category).ToList();
            var result = from p in _context.Products
                            orderby p.Category select p;
            return View(result.ToList());
        }
    }
}