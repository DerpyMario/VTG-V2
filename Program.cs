using System.Security.Cryptography;
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
            {
                KeyType.Archive,
                (Convert.FromHexString("1122345567889aaf5eb4cc884ab6dd00"),
                    Convert.FromHexString("00010203f0f5e1a2f151c69a390adefb"))
            },
            {
                KeyType.Pak,
                ("(V%((kWBL32drZvn"u8.ToArray(),
                    "eW/x/.rNrji3dCxL"u8.ToArray())
            }
        };

        static void Main(string[] args)
        {
           // ExtractAllAssets
           const string FilePath = @"Item.pak.c28080efaa682e2365f21c4137c83f707813d302";
           var data = Decrypt(File.ReadAllBytes(FilePath)[..^32], KeyType.Pak);
           Console.WriteLine(MessagePackSerializer.ConvertToJson(data));
        }

        static void ExtractAllAssets()
        {
            const string FilePath =
                @"assets";

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
            if (isLza)
                data = Decrypt(data, KeyType.Archive);

            return DecompressArchive(data);
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