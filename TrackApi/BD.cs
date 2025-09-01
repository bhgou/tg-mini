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
    // Добавить рецензию в БД
    public void Add(RecenziaModel rec)
    {
        string connectionString = "Host=localhost;Port=5432;Username=postgres;Password=2556;Database=postgres";
    string sql = "INSERT INTO recenzia (id, name, date, text, individ, harizma, vibe) VALUES (@id, @name, @date, @text, @individ, @harizma, @vibe)";
        using (var connection = new NpgsqlConnection(connectionString))
        {
            connection.Open();
            using (var command = new NpgsqlCommand(sql, connection))
            {
                command.Parameters.AddWithValue("id", rec.Id);
                command.Parameters.AddWithValue("name", rec.Name);
                command.Parameters.AddWithValue("date", rec.Date ?? "");
                command.Parameters.AddWithValue("text", rec.Text ?? "");
                command.Parameters.AddWithValue("individ", rec.Individ);
                command.Parameters.AddWithValue("harizma", rec.Harizma);
                command.Parameters.AddWithValue("vibe", rec.Vibe);
                command.ExecuteNonQuery();
            }
        }
    }

    // Прочитать все рецензии из БД
    public List<RecenziaModel> ReadRecenzii()
    {
        string connectionString = "Host=localhost;Port=5432;Username=postgres;Password=2556;Database=postgres";
        string sql = "SELECT * FROM recenzia";
        var result = new List<RecenziaModel>();
        using (var connection = new NpgsqlConnection(connectionString))
        {
            connection.Open();
            using (var command = new NpgsqlCommand(sql, connection))
            {
                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        result.Add(new RecenziaModel
                        {
                            Id = reader.GetInt64(reader.GetOrdinal("id")),
                            Name = reader.GetString(reader.GetOrdinal("name")),
                            Date = reader["date"]?.ToString() ?? "",
                            Text = reader["text"]?.ToString() ?? "",
                            Individ = reader.GetInt32(reader.GetOrdinal("individ")),
                            Harizma = reader.GetInt32(reader.GetOrdinal("harizma")),
                            Vibe = reader.GetInt32(reader.GetOrdinal("vibe"))
                        });
                    }
                }
            }
        }
        return result;
    }
}