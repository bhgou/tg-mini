using System;
using System.Data;
using Npgsql;
using System.Collections.Generic;

public class BD
{
    public List<TrackListModel> Read()
    {
        string connectionString = "Host=localhost;Port=5432;Username=postgres;Password=2556;Database=postgres";
        string sql = "SELECT * FROM tracklist4";
        var result = new List<TrackListModel>();
        using (var connection = new NpgsqlConnection(connectionString))
        {
            connection.Open();
            using (var command = new NpgsqlCommand(sql, connection))
            {
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        result.Add(new TrackListModel
                        {
                            Id = reader.GetInt64(reader.GetOrdinal("id")),
                            Url = reader.GetString(reader.GetOrdinal("url"))
                        });
                    }
                }
            }
        }
        return result;
    }

    public void Add(TrackListModel track)
    {
        string connectionString = "Host=localhost;Port=5432;Username=postgres;Password=2556;Database=postgres";
        string sql = "INSERT INTO tracklist4 (id, url) VALUES (@id, @url) ON CONFLICT (id) DO NOTHING";
        using (var connection = new NpgsqlConnection(connectionString))
        {
            connection.Open();
            using (var command = new NpgsqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("id", track.Id);
                command.Parameters.AddWithValue("url", track.Url);
                command.ExecuteNonQuery();
            }
        }
    }
}