using System.Threading.Tasks;
using System.Web.Http;
using FirstApp.Business.Repository;
using FirstApp.ModelLibrary;
using FirstApp.WebAPI.Helpers;

namespace FirstApp.WebAPI.Controllers
{
    public class AccountController : BaseApiController
    {
        public readonly IUserBL UserBL;
        public AccountController(IUserBL userBL)
        {
            UserBL = userBL;
        }

        [HttpPost]
        public async Task<IHttpActionResult> Login(LoginModel loginDetails)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            if (await Task.Run(() => UserBL.Login(loginDetails)))
            {
                return Json(new ResponseModel<string> { Status = 200, StatusMessage = "", Data = "success" });
            }
            return Json(new ResponseModel { Status = 404, StatusMessage = "Invalid Username or Password" });
        }

        [HttpPost]
        public async Task<IHttpActionResult> Registration(RegisterModel registerDetails)
        {
            if (!ModelState.IsValid)
            {
                return Json(new ResponseModel<string> { Status = 400, StatusMessage = "BadRequest", Data = "" });
            }
            AccountHelper.SeedUser(registerDetails);
            return Json(new ResponseModel<string> { Status = 200, StatusMessage = "", Data = "success" });
        }

        #region -------old methods
        //private DB_FirstAppEntities db = new DB_FirstAppEntities();

        //// GET: api/Account
        //public IQueryable<Tb_User> GetTb_User()
        //{
        //    return db.Tb_User;
        //}

        //// GET: api/Account/5
        //[ResponseType(typeof(Tb_User))]
        //public async Task<IHttpActionResult> GetTb_User(int id)
        //{
        //    Tb_User tb_User = await db.Tb_User.FindAsync(id);
        //    if (tb_User == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(tb_User);
        //}

        //// PUT: api/Account/5
        //[ResponseType(typeof(void))]
        //public async Task<IHttpActionResult> PutTb_User(int id, Tb_User tb_User)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    if (id != tb_User.UserId)
        //    {
        //        return BadRequest();
        //    }

        //    db.Entry(tb_User).State = EntityState.Modified;

        //    try
        //    {
        //        await db.SaveChangesAsync();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!Tb_UserExists(id))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        //// POST: api/Account
        //[ResponseType(typeof(Tb_User))]
        //public async Task<IHttpActionResult> PostTb_User(Tb_User tb_User)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    db.Tb_User.Add(tb_User);

        //    try
        //    {
        //        await db.SaveChangesAsync();
        //    }
        //    catch (DbUpdateException)
        //    {
        //        if (Tb_UserExists(tb_User.UserId))
        //        {
        //            return Conflict();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return CreatedAtRoute("DefaultApi", new { id = tb_User.UserId }, tb_User);
        //}

        //// DELETE: api/Account/5
        //[ResponseType(typeof(Tb_User))]
        //public async Task<IHttpActionResult> DeleteTb_User(int id)
        //{
        //    Tb_User tb_User = await db.Tb_User.FindAsync(id);
        //    if (tb_User == null)
        //    {
        //        return NotFound();
        //    }

        //    db.Tb_User.Remove(tb_User);
        //    await db.SaveChangesAsync();

        //    return Ok(tb_User);
        //}

        //protected override void Dispose(bool disposing)
        //{
        //    if (disposing)
        //    {
        //        db.Dispose();
        //    }
        //    base.Dispose(disposing);
        //}

        //private bool Tb_UserExists(int id)
        //{
        //    return db.Tb_User.Count(e => e.UserId == id) > 0;
        //}
        #endregion

    }
}