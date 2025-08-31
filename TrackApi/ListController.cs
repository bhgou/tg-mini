using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;

namespace MyWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ListController : ControllerBase
    {
        // Получить все треки из БД
        [HttpGet("tracks")]
        public ActionResult<IEnumerable<TrackListModel>> GetTracksFromDb()
        {
            var db = new BD();
            var tracks = db.Read();
            return Ok(tracks);
        }

        // POST: api/list/tracks
        [HttpPost("addtrack")]
        public IActionResult AddTracksFromJson([FromBody] List<TrackListModel> tracks)
        {
            var db = new BD();
            foreach (var track in tracks)
            {
                db.Add(track);
            }
            return Ok();
        }
    }
}