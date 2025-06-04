using System.Security.Cryptography;
using System.Text.Json;
using MessagePack;

namespace DolphinWaveExtractor
{
    internal class Program
    {
        enum KeyType
        {
            Archive,
            Pak
        }

        private static Dictionary<KeyType, (byte[] key, byte[] iv)> Keys = new()
        {
            { KeyType.Archive, (Convert.FromHexString("1122345567889aaf5eb4cc884ab6dd00"), Convert.FromHexString("00010203f0f5e1a2f151c69a390adefb")) },
            { KeyType.Pak, ("(V%((kWBL32drZvn"u8.ToArray(), "eW/x/.rNrji3dCxL"u8.ToArray()) }
        };

        static void Main(string[] args)
        {
            string searchPath = ".";
            string searchPattern = "*.pak";

            // Check if arguments are provided
            if (args.Length > 0)
            {
                if (File.Exists(args[0]))
                {
                    // Single file processing
                    ProcessPakFile(args[0]);
                    return;
                }
                else if (Directory.Exists(args[0]))
                {
                    searchPath = args[0];
                }
                else
                {
                    Console.WriteLine($"Path not found: {args[0]}");
                    return;
                }
            }

            // Process all .pak files in directory
            var pakFiles = Directory.GetFiles(searchPath, searchPattern, SearchOption.TopDirectoryOnly);
            
            if (pakFiles.Length == 0)
            {
                Console.WriteLine($"No .pak files found in {searchPath}");
                Console.WriteLine("Usage: DolphinWaveExtractor [file.pak|directory]");
                return;
            }

            Console.WriteLine($"Found {pakFiles.Length} .pak file(s)");
            
            foreach (var pakFile in pakFiles)
            {
                Console.WriteLine($"\nProcessing: {pakFile}");
                ProcessPakFile(pakFile);
            }
        }

        static void ProcessPakFile(string filePath)
        {
            try
            {
                var fileData = File.ReadAllBytes(filePath);
                Console.WriteLine($"File size: {fileData.Length} bytes");

                // Remove the last 32 bytes (likely signature/hash)
                var dataToDecrypt = fileData[..^32];
                
                var decryptedData = Decrypt(dataToDecrypt, KeyType.Pak);
                Console.WriteLine($"Decrypted size: {decryptedData.Length} bytes");
                // Try different parsing methods
                bool success = false;

                // Method 1: Try MessagePack deserialization
                success = TryMessagePackDeserialization(decryptedData, filePath);

                // Method 2: Try custom binary format parsing
                if (!success)
                {
                    success = TryCustomBinaryParsing(decryptedData, filePath);
                }

                // Method 3: Try raw JSON parsing (if data is already JSON)
                if (!success)
                {
                    success = TryRawJsonParsing(decryptedData, filePath);
                }

                // Method 4: Save raw decrypted data for manual inspection
                if (!success)
                {
                    SaveRawData(decryptedData, filePath);
                }

                if (success)
                {
                    Console.WriteLine($"✓ Successfully processed {Path.GetFileName(filePath)}");
                }
                else
                {
                    Console.WriteLine($"⚠ Could not parse {Path.GetFileName(filePath)} - saved raw data for inspection");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"✗ Error processing {Path.GetFileName(filePath)}: {ex.Message}");
            }
        }

        static bool TryMessagePackDeserialization(byte[] data, string originalPath)
        {
            try
            {
                var json = MessagePackSerializer.ConvertToJson(data);
                
                // Pretty format the JSON
                var jsonDoc = JsonDocument.Parse(json);
                var formattedJson = JsonSerializer.Serialize(jsonDoc, new JsonSerializerOptions 
                { 
                    WriteIndented = true,
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                });

                var outputPath = Path.ChangeExtension(originalPath, ".msgpack.json");
                File.WriteAllText(outputPath, formattedJson);
                
                Console.WriteLine($"  → MessagePack JSON saved to: {Path.GetFileName(outputPath)}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"  MessagePack parsing failed: {ex.Message}");
                return false;
            }
        }

        static bool TryCustomBinaryParsing(byte[] data, string originalPath)
        {
            try
            {
                using var stream = new MemoryStream(data);
                using var reader = new BinaryReader(stream);
                
                var entries = new List<object>();
                var fileEntries = new List<HeaderEntry>();

                // Try parsing as HeaderEntry format
                while (stream.Position < stream.Length - 64) // Leave buffer for incomplete data
                {
                    try
                    {
                        var entry = new HeaderEntry(reader);
                        fileEntries.Add(entry);
                        
                        // Convert to anonymous object for better JSON serialization
                        entries.Add(new
                        {
                            TotalFileCount = entry.TotalFileCount,
                            Type = entry.Type,
                            Offset = entry.Offset,
                            Length = entry.Length,
                            Id = entry.Id,
                            Name = entry.Name
                        });
                    }
                    catch
                    {
                        break;
                    }
                }

                if (entries.Count > 0)
                {
                    var result = new
                    {
                        FileCount = entries.Count,
                        ParsedAt = DateTime.UtcNow,
                        SourceFile = Path.GetFileName(originalPath),
                        Entries = entries
                    };

                    var json = JsonSerializer.Serialize(result, new JsonSerializerOptions 
                    { 
                        WriteIndented = true,
                        Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                    });

                    var outputPath = Path.ChangeExtension(originalPath, ".parsed.json");
                    File.WriteAllText(outputPath, json);
                    
                    Console.WriteLine($"  → Custom binary JSON saved to: {Path.GetFileName(outputPath)}");
                    Console.WriteLine($"  → Found {entries.Count} file entries");
                    
                    // Print first few entries as preview
                    for (int i = 0; i < Math.Min(3, fileEntries.Count); i++)
                    {
                        var entry = fileEntries[i];
                        Console.WriteLine($"    [{i}] {entry.Name} (Size: {entry.Length}, Type: {entry.Type})");
                    }
                    
                    if (fileEntries.Count > 3)
                    {
                        Console.WriteLine($"    ... and {fileEntries.Count - 3} more entries");
                    }

                    return true;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"  Custom binary parsing failed: {ex.Message}");
            }
            
            return false;
        }

        static bool TryRawJsonParsing(byte[] data, string originalPath)
        {
            try
            {
                var jsonString = System.Text.Encoding.UTF8.GetString(data).Trim('\0');
                
                // Try to parse as JSON
                var jsonDoc = JsonDocument.Parse(jsonString);
                var formattedJson = JsonSerializer.Serialize(jsonDoc, new JsonSerializerOptions 
                { 
                    WriteIndented = true,
                    Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                });

                var outputPath = Path.ChangeExtension(originalPath, ".raw.json");
                File.WriteAllText(outputPath, formattedJson);
                
                Console.WriteLine($"  → Raw JSON saved to: {Path.GetFileName(outputPath)}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"  Raw JSON parsing failed: {ex.Message}");
                return false;
            }
        }

        static void SaveRawData(byte[] data, string originalPath)
        {
            // Save raw decrypted data
            var rawPath = Path.ChangeExtension(originalPath, ".decrypted.bin");
            File.WriteAllBytes(rawPath, data);
            
            // Save hex dump for inspection
            var hexPath = Path.ChangeExtension(originalPath, ".hex.txt");
            var hexDump = CreateHexDump(data, Math.Min(data.Length, 1024)); // First 1KB
            File.WriteAllText(hexPath, hexDump);
            
            Console.WriteLine($"  → Raw data saved to: {Path.GetFileName(rawPath)}");
            Console.WriteLine($"  → Hex dump saved to: {Path.GetFileName(hexPath)}");
            
            // Try to detect data type
            DetectDataType(data);
        }

        static string CreateHexDump(byte[] data, int length)
        {
            var sb = new System.Text.StringBuilder();
            sb.AppendLine($"Hex dump (first {length} bytes of {data.Length} total):");
            sb.AppendLine("Offset    00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F  ASCII");
            sb.AppendLine("--------  -----------------------------------------------  ----------------");
            
            for (int i = 0; i < length; i += 16)
            {
                sb.Append($"{i:X8}  ");
                
                // Hex bytes
                for (int j = 0; j < 16; j++)
                {
                    if (i + j < length)
                        sb.Append($"{data[i + j]:X2} ");
                    else
                        sb.Append("   ");
                }
                
                sb.Append(" ");
                
                // ASCII representation
                for (int j = 0; j < 16 && i + j < length; j++)
                {
                    byte b = data[i + j];
                    sb.Append(b >= 32 && b <= 126 ? (char)b : '.');
                }
                
                sb.AppendLine();
            }
            
            return sb.ToString();
        }

        static void DetectDataType(byte[] data)
        {
            if (data.Length < 4) return;
            
            // Check for common file signatures
            var signature = BitConverter.ToUInt32(data, 0);
            var firstBytes = data.Take(16).ToArray();
            
            Console.WriteLine($"  Data analysis:");
            Console.WriteLine($"    First 4 bytes: 0x{signature:X8}");
            Console.WriteLine($"    First 16 bytes: {Convert.ToHexString(firstBytes)}");
            
            // Check if it looks like text
            int printableChars = data.Take(100).Count(b => b >= 32 && b <= 126);
            if (printableChars > 80)
            {
                Console.WriteLine($"    Likely contains text data ({printableChars}% printable in first 100 bytes)");
                var preview = System.Text.Encoding.UTF8.GetString(data.Take(100).ToArray());
                Console.WriteLine($"    Preview: {preview.Replace('\n', ' ').Replace('\r', ' ')}");
            }
        }

        static byte[] Decrypt(byte[] data, KeyType type)
        {
            using var aes = Aes.Create();
            aes.Mode = CipherMode.CBC;
            aes.Padding = PaddingMode.PKCS7;
            aes.Key = Keys[type].key;
            aes.IV = Keys[type].iv;

            using var decryptor = aes.CreateDecryptor();
            return decryptor.TransformFinalBlock(data, 0, data.Length);
        }

        // Keep existing methods for archive processing
        static void ExtractAllAssets()
        {
            const string FilePath = @"assets";
            foreach (var file in Directory.EnumerateFiles(FilePath, "*.lza", SearchOption.AllDirectories))
            {
                if (file.Contains("UI")) continue;
                var outputDir = Path.Join(Path.GetDirectoryName(file), Path.GetFileNameWithoutExtension(file));
                var archive = ReadArchive(file);
                ExtractFiles(outputDir, archive);
            }
        }

        static byte[] ReadArchive(string filename)
        {
            var isLza = filename.EndsWith(".lza");
            var data = File.ReadAllBytes(filename);
            if (isLza) data = Decrypt(data, KeyType.Archive);
            return DecompressArchive(data);
        }

        static byte[] DecompressArchive(byte[] archive)
        {
            var decompressedLength = BitConverter.ToInt32(archive.AsSpan(0, 4));
            var compressed = archive.AsSpan(4..);
            var decompressedBuffer = new byte[decompressedLength];
            var decompressed = decompressedBuffer.AsSpan();

            var compressedInd = 0;
            var decompressedInd = 0;

            var v7 = new byte[0x1000].AsSpan();

            int v2, v6, v9, v12, v13, v14, v15;
            byte v10, v17;
            v2 = 0;
            v6 = 0xfee;

            for (int i = 0; i < decompressedLength; i += v13 + 3)
            {
                while (true)
                {
                    v2 >>= 1;
                    if ((v2 & 0x100) == 0)
                    {
                        v9 = compressed[compressedInd++];
                        v2 = v9 | 0xff00;
                    }
                    v10 = compressed[compressedInd++];
                    if ((v2 & 1) == 0)
                        break;

                    decompressed[decompressedInd++] = v10;
                    if (++i >= decompressedLength)
                        return decompressedBuffer;

                    v7[v6] = v10;
                    v6 = (v6 + 1) & 0xfff;
                }

                v12 = compressed[compressedInd++];
                v13 = v12 & 0xf;
                v14 = (v12 & 0xf0) << 4 | v10;
                v15 = v13 + 3;
                for (; v15 != 0; --v15)
                {
                    v17 = v7[v14++ & 0xfff];
                    v7[v6] = v17;
                    decompressed[decompressedInd++] = v17;
                    v6 = (v6 + 1) & 0xfff;
                }
            }

            return decompressedBuffer;
        }

        static void ExtractFiles(string outputDir, byte[] archive)
        {
            Directory.CreateDirectory(outputDir);

            using var reader = new BinaryReader(new MemoryStream(archive));
            var entries = new List<HeaderEntry>();
            var firstFile = new HeaderEntry(reader);
            entries.Add(firstFile);

            for (int i = 1; i < firstFile.TotalFileCount; i++) 
                entries.Add(new HeaderEntry(reader));

            foreach (var entry in entries)
            {
                Console.WriteLine($"Got file: {entry.Name}");

                var output = Path.Join(outputDir, entry.Name);
                reader.BaseStream.Seek(entry.Offset, SeekOrigin.Begin);
                File.WriteAllBytes(output, reader.ReadBytes(entry.Length));
            }
		}
    }
}
