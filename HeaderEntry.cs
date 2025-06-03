using System.Text;

namespace DolphinWaveExtractor;

public struct HeaderEntry
{
    public ushort TotalFileCount;
    public ushort Type;
    public int Offset;
    public int Length;
    public int Id;
    public string Name;

    public HeaderEntry(BinaryReader reader)
    {
        TotalFileCount = reader.ReadUInt16();
        Type = reader.ReadUInt16();
        Offset = reader.ReadInt32();
        Length = reader.ReadInt32();
        Id = reader.ReadInt32();

        var nameBytes = reader.ReadBytes(0x30);
        var nameLength = 0;
        for (; nameBytes[nameLength] != 0x0; ++nameLength) {}
        Name = Encoding.UTF8.GetString(nameBytes, 0, nameLength);
    }
}
