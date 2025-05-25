#!/usr/bin/env python3
"""
StageLib Unity Scene JSON Decoder/Encoder - Batch Processing Version
Decrypts, decompresses and deserializes StageLib scene files
Supports batch processing, drag-and-drop folders, and reverse encoding

Usage Examples:

GUI Mode (recommended):

python stagelib_encoder_decoder.py --gui

Encode single JSON file:

python stagelib_encoder_decoder.py decoded_file.json --mode encode

Batch encode folder of JSON files:

python stagelib_encoder_decoder.py /path/to/json/folder --mode encode -o /path/to/output

Decode (original functionality):

python stagelib_encoder_decoder.py encrypted_file.json --mode decode

Round-trip test:

# Decode original file
python stagelib_encoder_decoder.py original.json --mode decode

# Encode back to StageLib format
python stagelib_encoder_decoder.py original.json --mode encode

# The result should be functionally identical to the original

The encoding process properly reverses all the steps, ensuring that encoded files can be read by the original Unity StageLib system. The clean_json_data() function removes any extra fields that were added during decoding (like _type_name) to maintain compatibility.

"""

import base64
import json
import lz4.block
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad, pad
import struct
from typing import Dict, Any, List, Optional
from enum import IntEnum
import argparse
import sys
import os
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox, ttk
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

class StageObjType(IntEnum):
    """Stage object types from StageObjType.cs"""
    PREFAB_OBJ = 0
    START_OBJ = 1
    END_OBJ = 2
    ENEMY_OBJ = 3
    CAMERA_OBJ = 4
    LIGHT_OBJ = 5
    BG_OBJ = 6
    LOCK_RANGE_OBJ = 7
    ENEMYEP_OBJ = 8
    DEADAREA_OBJ = 9
    MAPEVENT_OBJ = 10
    BLOCKWALL_OBJ = 11
    STAGECTRL_OBJ = 12
    STAGECOLLISION_OBJ = 13
    STAGEONEWORK_OBJ = 14
    STAGEREBORN_OBJ = 15
    RIDEABLE_OBJ = 16
    PATROLPATH_OBJ = 17
    DATAPOING_OBJ = 18
    MIX_OBJ = 99

class AesCrypto:
    """AES encryption/decryption based on AesCrypto.cs"""
    
    ENCRYPT_KEY = "cbs4/+-jDAf!?s/#cbs4/+-jDAf!?s/#"
    IV = "=!r19kCsGHTAcr/@"
    
    @classmethod
    def decode(cls, encrypted_string: str) -> str:
        """Decode AES encrypted string"""
        try:
            encrypted_data = base64.b64decode(encrypted_string)
            return cls.decode_bytes(encrypted_data).decode('utf-8')
        except Exception:
            return ""
    
    @classmethod
    def decode_bytes(cls, encrypted_data: bytes) -> bytes:
        """Decode AES encrypted bytes"""
        key = cls.ENCRYPT_KEY.encode('utf-8')
        iv = cls.IV.encode('utf-8')
        
        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted = cipher.decrypt(encrypted_data)
        
        # Remove PKCS7 padding
        return unpad(decrypted, AES.block_size)
    
    @classmethod
    def encode(cls, plain_string: str) -> str:
        """Encode string with AES encryption"""
        try:
            plain_data = plain_string.encode('utf-8')
            encrypted_data = cls.encode_bytes(plain_data)
            return base64.b64encode(encrypted_data).decode('utf-8')
        except Exception as e:
            raise ValueError(f"Failed to AES encode: {e}")
    
    @classmethod
    def encode_bytes(cls, plain_data: bytes) -> bytes:
        """Encode bytes with AES encryption"""
        key = cls.ENCRYPT_KEY.encode('utf-8')
        iv = cls.IV.encode('utf-8')
        
        # Add PKCS7 padding
        padded_data = pad(plain_data, AES.block_size)
        
        cipher = AES.new(key, AES.MODE_CBC, iv)
        encrypted = cipher.encrypt(padded_data)
        
        return encrypted

class LZ4Helper:
    """LZ4 compression/decompression based on LZ4Helper.cs"""
    
    @classmethod
    def decode_with_header(cls, compressed_data: bytes) -> bytes:
        """Decode LZ4 compressed data with header"""
        # First 4 bytes contain the original length
        original_length = struct.unpack('<I', compressed_data[:4])[0]
        compressed_payload = compressed_data[4:]
        
        # Decompress using LZ4
        return lz4.block.decompress(compressed_payload, uncompressed_size=original_length)
    
    @classmethod
    def encode_with_header(cls, uncompressed_data: bytes) -> bytes:
        """Encode data with LZ4 compression and header"""
        # Compress the data
        compressed_payload = lz4.block.compress(uncompressed_data, store_size=False)
        
        # Create header with original length (4 bytes, little endian)
        header = struct.pack('<I', len(uncompressed_data))
        
        # Combine header and compressed data
        return header + compressed_payload

class Vector3:
    """Vector3 representation"""
    def __init__(self, x: float = 0, y: float = 0, z: float = 0):
        self.x = x
        self.y = y
        self.z = z
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Vector3':
        return cls(
            x=float(data.get('x', 0)),
            y=float(data.get('y', 0)),
            z=float(data.get('z', 0))
        )
    
    def to_dict(self) -> Dict[str, float]:
        return {'x': self.x, 'y': self.y, 'z': self.z}

class Quaternion:
    """Quaternion representation"""
    def __init__(self, x: float = 0, y: float = 0, z: float = 0, w: float = 1):
        self.x = x
        self.y = y
        self.z = z
        self.w = w
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Quaternion':
        return cls(
            x=float(data.get('x', 0)),
            y=float(data.get('y', 0)),
            z=float(data.get('z', 0)),
            w=float(data.get('w', 1))
        )
    
    def to_dict(self) -> Dict[str, float]:
        return {'x': self.x, 'y': self.y, 'z': self.z, 'w': self.w}

class StageObjData:
    """Base stage object data"""
    def __init__(self, data: Dict[str, Any]):
        self.obj_type = data.get('objtype', 0)
        self.name = data.get('name', '')
        self.position = Vector3.from_dict(data.get('position', {}))
        self.rotation = Quaternion.from_dict(data.get('rotate', {}))
        self.scale = Vector3.from_dict(data.get('scale', {'x': 1, 'y': 1, 'z': 1}))
        self.property = data.get('property', '')
        self.group_name = data.get('groupname', '')
        self.raw_data = data

class StageData:
    """Main stage data container based on StageData.cs"""
    def __init__(self):
        self.version = 0
        self.stage_clip_width = 0.0
        self.objects: List[StageObjData] = []
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'StageData':
        stage_data = cls()
        stage_data.version = data.get('nVer', 0)
        stage_data.stage_clip_width = data.get('fStageClipWidth', 0.0)
        
        # Parse stage objects
        for obj_data in data.get('Datas', []):
            stage_data.objects.append(StageObjData(obj_data))
        
        return stage_data

class ProcessingResult:
    """Result of processing a single file"""
    def __init__(self, file_path: str, success: bool, error: str = None, output_path: str = None):
        self.file_path = file_path
        self.success = success
        self.error = error
        self.output_path = output_path

class StageDecoder:
    """Main decoder/encoder class for StageLib files"""
    
    def __init__(self):
        self.stage_data: Optional[StageData] = None
    
    def decode_file(self, file_path: str) -> StageData:
        """Decode a StageLib file"""
        with open(file_path, 'r', encoding='utf-8') as f:
            encrypted_content = f.read().strip()
        
        return self.decode_string(encrypted_content)
    
    def decode_string(self, encrypted_content: str) -> StageData:
        """Decode encrypted string content"""
        # Step 1: AES Decrypt
        decrypted_content = AesCrypto.decode(encrypted_content)
        
        if not decrypted_content:
            # Try parsing as plain JSON if decryption fails
            try:
                json_data = json.loads(encrypted_content)
                return StageData.from_dict(json_data)
            except json.JSONDecodeError:
                raise ValueError("Failed to decrypt or parse as JSON")
        
        # Step 2: Base64 Decode
        try:
            compressed_data = base64.b64decode(decrypted_content)
        except Exception as e:
            raise ValueError(f"Failed to base64 decode: {e}")
        
        # Step 3: LZ4 Decompress
        try:
            decompressed_data = LZ4Helper.decode_with_header(compressed_data)
        except Exception as e:
            raise ValueError(f"Failed to LZ4 decompress: {e}")
        
        # Step 4: JSON Parse
        try:
            json_content = decompressed_data.decode('utf-8')
            json_data = json.loads(json_content)
        except Exception as e:
            raise ValueError(f"Failed to parse JSON: {e}")
        
        # Step 5: Convert to StageData
        self.stage_data = StageData.from_dict(json_data)
        return self.stage_data
    
    def encode_from_json_file(self, json_file_path: str) -> str:
        """Encode a JSON file back to StageLib format"""
        with open(json_file_path, 'r', encoding='utf-8') as f:
            json_data = json.load(f)
        
        return self.encode_from_dict(json_data)
    
    def encode_from_dict(self, json_data: Dict[str, Any]) -> str:
        """Encode JSON data back to StageLib format"""
        # Step 1: Clean the JSON data (remove any added fields like _type_name)
        cleaned_data = self.clean_json_data(json_data)
        
        # Step 2: Convert to JSON string
        json_string = json.dumps(cleaned_data, ensure_ascii=False, separators=(',', ':'))
        
        # Step 3: UTF-8 encode
        json_bytes = json_string.encode('utf-8')
        
        # Step 4: LZ4 Compress with header
        compressed_data = LZ4Helper.encode_with_header(json_bytes)
        
        # Step 5: Base64 Encode
        base64_encoded = base64.b64encode(compressed_data).decode('utf-8')
        
        # Step 6: AES Encrypt
        encrypted_content = AesCrypto.encode(base64_encoded)
        
        return encrypted_content
    
    def clean_json_data(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Clean JSON data by removing any added fields"""
        cleaned = data.copy()
        
        # Clean the Datas array
        if 'Datas' in cleaned:
            cleaned_datas = []
            for obj_data in cleaned['Datas']:
                cleaned_obj = obj_data.copy()
                # Remove any fields that start with underscore (like _type_name)
                cleaned_obj = {k: v for k, v in cleaned_obj.items() if not k.startswith('_')}
                cleaned_datas.append(cleaned_obj)
            cleaned['Datas'] = cleaned_datas
        
        return cleaned
    
    def encode_to_file(self, json_file_path: str, output_path: str):
        """Encode a JSON file and save to StageLib format"""
        encrypted_content = self.encode_from_json_file(json_file_path)
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(encrypted_content)
    
    def get_objects_by_type(self, obj_type: StageObjType) -> List[StageObjData]:
        """Get all objects of a specific type"""
        if not self.stage_data:
            return []
        
        return [obj for obj in self.stage_data.objects if obj.obj_type == obj_type.value]
    
    def get_type_name(self, obj_type: int) -> str:
        """Get the name of an object type"""
        try:
            return StageObjType(obj_type).name
        except ValueError:
            return f"UNKNOWN_{obj_type}"
    
    def export_to_json(self, output_path: str, pretty: bool = True):
        """Export decoded data to JSON file"""
        if not self.stage_data:
            raise ValueError("No stage data to export")
        
        export_data = {
            'nVer': self.stage_data.version,
            'fStageClipWidth': self.stage_data.stage_clip_width,
            'Datas': []
        }
        
        for obj in self.stage_data.objects:
            obj_data = obj.raw_data.copy()
            obj_data['_type_name'] = self.get_type_name(obj.obj_type)
            export_data['Datas'].append(obj_data)
        
        # Ensure output directory exists
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        with open(output_path, 'w', encoding='utf-8') as f:
            if pretty:
                json.dump(export_data, f, indent=2, ensure_ascii=False)
            else:
                json.dump(export_data, f, ensure_ascii=False)

class BatchProcessor:
    """Handles batch processing of multiple files"""
    
    def __init__(self, max_workers: int = 4):
        self.max_workers = max_workers
        self.progress_callback = None
    
    def set_progress_callback(self, callback):
        """Set callback function for progress updates"""
        self.progress_callback = callback
    
    def find_files(self, directory: str, extensions: List[str] = None) -> List[str]:
        """Find all files with specified extensions in directory and subdirectories"""
        if extensions is None:
            extensions = ['.json']
        
        files = []
        directory_path = Path(directory)
        
        for ext in extensions:
            files.extend(directory_path.rglob(f'*{ext}'))
        
        return [str(f) for f in files]
    
    def process_single_file_decode(self, file_path: str, output_dir: str = None, compact: bool = False) -> ProcessingResult:
        """Process a single file for decoding"""
        try:
            decoder = StageDecoder()
            stage_data = decoder.decode_file(file_path)
            
            # Determine output path
            if output_dir:
                file_name = Path(file_path).stem + '.json'
                output_path = os.path.join(output_dir, file_name)
            else:
                output_path = str(Path(file_path).with_suffix('')) + '.json'
            
            decoder.export_to_json(output_path, pretty=not compact)
            
            return ProcessingResult(file_path, True, output_path=output_path)
            
        except Exception as e:
            return ProcessingResult(file_path, False, error=str(e))
    
    def process_single_file_encode(self, file_path: str, output_dir: str = None) -> ProcessingResult:
        """Process a single JSON file for encoding back to StageLib format"""
        try:
            decoder = StageDecoder()
            
            # Determine output path
            if output_dir:
                file_name = Path(file_path).stem + '.json'
                output_path = os.path.join(output_dir, file_name)
            else:
                output_path = str(Path(file_path).with_suffix('')) + '.json'
            
            decoder.encode_to_file(file_path, output_path)
            
            return ProcessingResult(file_path, True, output_path=output_path)
            
        except Exception as e:
            return ProcessingResult(file_path, False, error=str(e))
    
    def process_batch_decode(self, file_paths: List[str], output_dir: str = None, compact: bool = False) -> List[ProcessingResult]:
        """Process multiple files for decoding in parallel"""
        results = []
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Submit all tasks
            future_to_file = {
                executor.submit(self.process_single_file_decode, file_path, output_dir, compact): file_path
                for file_path in file_paths
            }
            
            # Process completed tasks
            for i, future in enumerate(as_completed(future_to_file)):
                result = future.result()
                results.append(result)
                
                # Update progress
                if self.progress_callback:
                    self.progress_callback(i + 1, len(file_paths), result)
        
        return results
    
    def process_batch_encode(self, file_paths: List[str], output_dir: str = None) -> List[ProcessingResult]:
        """Process multiple JSON files for encoding in parallel"""
        results = []
        
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            # Submit all tasks
            future_to_file = {
                executor.submit(self.process_single_file_encode, file_path, output_dir): file_path
                for file_path in file_paths
            }
            
            # Process completed tasks
            for i, future in enumerate(as_completed(future_to_file)):
                result = future.result()
                results.append(result)
                
                # Update progress
                if self.progress_callback:
                    self.progress_callback(i + 1, len(file_paths), result)
        
        return results

class GUI:
    """Enhanced GUI for drag-and-drop functionality with encode/decode options"""
    
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("StageLib Batch Decoder/Encoder")
        self.root.geometry("700x500")
        
        self.processor = BatchProcessor()
        self.processor.set_progress_callback(self.update_progress)
        
        self.setup_ui()
    
    def setup_ui(self):
        """Setup the user interface"""
        # Main frame
        main_frame = tk.Frame(self.root, padx=20, pady=20)
        main_frame.pack(fill=tk.BOTH, expand=True)
        
        # Title
        title_label = tk.Label(main_frame, text="StageLib Batch Decoder/Encoder", 
                              font=("Arial", 16, "bold"))
        title_label.pack(pady=(0, 20))
        
        # Mode selection frame
        mode_frame = tk.LabelFrame(main_frame, text="Processing Mode", padx=10, pady=10)
        mode_frame.pack(fill=tk.X, pady=(0, 20))
        
        self.mode_var = tk.StringVar(value="decode")
        
        decode_radio = tk.Radiobutton(mode_frame, text="Decode (StageLib → JSON)", 
                                     variable=self.mode_var, value="decode",
                                     command=self.on_mode_change)
        decode_radio.pack(anchor=tk.W)
        
        encode_radio = tk.Radiobutton(mode_frame, text="Encode (JSON → StageLib)", 
                                     variable=self.mode_var, value="encode",
                                     command=self.on_mode_change)
        encode_radio.pack(anchor=tk.W)
        
        # Instructions
        self.instructions_label = tk.Label(main_frame, 
                                          text="Select folders or files to decode StageLib files to JSON",
                                          font=("Arial", 10))
        self.instructions_label.pack(pady=(0, 20))
        
        # Buttons frame
        buttons_frame = tk.Frame(main_frame)
        buttons_frame.pack(pady=(0, 20))
        
        # Select folder button
        folder_btn = tk.Button(buttons_frame, text="Select Folder", 
                              command=self.select_folder, width=15)
        folder_btn.pack(side=tk.LEFT, padx=(0, 10))
        
        # Select files button
        files_btn = tk.Button(buttons_frame, text="Select Files", 
                             command=self.select_files, width=15)
        files_btn.pack(side=tk.LEFT)
        
        # Options frame
        options_frame = tk.LabelFrame(main_frame, text="Options", padx=10, pady=10)
        options_frame.pack(fill=tk.X, pady=(0, 20))
        
        # Compact JSON option (only for decode mode)
        self.compact_var = tk.BooleanVar()
        self.compact_check = tk.Checkbutton(options_frame, text="Compact JSON output", 
                                           variable=self.compact_var)
        self.compact_check.pack(anchor=tk.W)
        
        # Output directory option
        output_frame = tk.Frame(options_frame)
        output_frame.pack(fill=tk.X, pady=(10, 0))
        
        tk.Label(output_frame, text="Output Directory (optional):").pack(anchor=tk.W)
        
        output_dir_frame = tk.Frame(output_frame)
        output_dir_frame.pack(fill=tk.X, pady=(5, 0))
        
        self.output_dir_var = tk.StringVar()
        self.output_dir_entry = tk.Entry(output_dir_frame, textvariable=self.output_dir_var)
        self.output_dir_entry.pack(side=tk.LEFT, fill=tk.X, expand=True)
        
        browse_btn = tk.Button(output_dir_frame, text="Browse", 
                              command=self.select_output_dir, width=10)
        browse_btn.pack(side=tk.RIGHT, padx=(10, 0))
        
        # Progress frame
        progress_frame = tk.Frame(main_frame)
        progress_frame.pack(fill=tk.X, pady=(0, 20))
        
        self.progress_label = tk.Label(progress_frame, text="Ready to process files...")
        self.progress_label.pack(anchor=tk.W)
        
        # Results text area
        results_frame = tk.LabelFrame(main_frame, text="Results", padx=10, pady=10)
        results_frame.pack(fill=tk.BOTH, expand=True)
        
        # Text widget with scrollbar
        text_frame = tk.Frame(results_frame)
        text_frame.pack(fill=tk.BOTH, expand=True)
        
        self.results_text = tk.Text(text_frame, wrap=tk.WORD, height=10)
        scrollbar = tk.Scrollbar(text_frame, orient=tk.VERTICAL, command=self.results_text.yview)
        self.results_text.configure(yscrollcommand=scrollbar.set)
        
        self.results_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
        
        # Clear results button
        clear_btn = tk.Button(results_frame, text="Clear Results", command=self.clear_results)
        clear_btn.pack(pady=(10, 0))
    
    def on_mode_change(self):
        """Handle mode change between encode/decode"""
        mode = self.mode_var.get()
        if mode == "decode":
            self.instructions_label.config(text="Select folders or files to decode StageLib files to JSON")
            self.compact_check.config(state=tk.NORMAL)
        else:
            self.instructions_label.config(text="Select folders or files to encode JSON files to StageLib format")
            self.compact_check.config(state=tk.DISABLED)
    
    def select_folder(self):
        """Select a folder to process"""
        folder_path = filedialog.askdirectory(title="Select folder containing files")
        if folder_path:
            self.process_folder(folder_path)
    
    def select_files(self):
        """Select individual files to process"""
        mode = self.mode_var.get()
        
        if mode == "decode":
            filetypes = [
                ("StageLib JSON files", "*.json"),
                ("All files", "*.*")
            ]
            title = "Select StageLib JSON files to decode"
        else:
            filetypes = [
                ("JSON files", "*.json"),
                ("All files", "*.*")
            ]
            title = "Select StageLib JSON files to encode"
        
        file_paths = filedialog.askopenfilenames(title=title, filetypes=filetypes)
        if file_paths:
            self.process_files(list(file_paths))
    
    def select_output_dir(self):
        """Select output directory"""
        output_dir = filedialog.askdirectory(title="Select output directory")
        if output_dir:
            self.output_dir_var.set(output_dir)
    
    def process_folder(self, folder_path: str):
        """Process all files in a folder"""
        self.clear_results()
        self.log_message(f"Scanning folder: {folder_path}")
        
        mode = self.mode_var.get()
        
        if mode == "decode":
            extensions = ['.json']
            file_type = "JSON"
        else:
            extensions = ['.json']
            file_type = "JSON"
        
        # Find all files
        files = self.processor.find_files(folder_path, extensions)
        
        if not files:
            self.log_message(f"No {file_type} files found in the selected folder.")
            return
        
        self.log_message(f"Found {len(files)} {file_type} files to process:")
        for file_path in files:
            self.log_message(f"  - {os.path.basename(file_path)}")
        
        self.process_files(files)
    
    def process_files(self, file_paths: List[str]):
        """Process a list of files"""
        if not file_paths:
            return
        
        # Start processing in a separate thread to avoid blocking UI
        def process_thread():
            output_dir = self.output_dir_var.get().strip() or None
            mode = self.mode_var.get()
            
            self.log_message(f"\nStarting batch {mode} processing of {len(file_paths)} files...")
            
            if mode == "decode":
                compact = self.compact_var.get()
                results = self.processor.process_batch_decode(file_paths, output_dir, compact)
            else:
                results = self.processor.process_batch_encode(file_paths, output_dir)
            
            # Summary
            successful = sum(1 for r in results if r.success)
            failed = len(results) - successful
            
            self.log_message(f"\n=== Processing Complete ===")
            self.log_message(f"Successfully processed: {successful}")
            self.log_message(f"Failed: {failed}")
            
            if failed > 0:
                self.log_message(f"\nFailed files:")
                for result in results:
                    if not result.success:
                        self.log_message(f"  - {os.path.basename(result.file_path)}: {result.error}")
        
        # Run in separate thread
        thread = threading.Thread(target=process_thread)
        thread.daemon = True
        thread.start()
    
    def update_progress(self, current: int, total: int, result: ProcessingResult):
        """Update progress display"""
        progress_text = f"Processing: {current}/{total} - {os.path.basename(result.file_path)}"
        self.progress_label.config(text=progress_text)
        
        if result.success:
            self.log_message(f"✓ {os.path.basename(result.file_path)} -> {os.path.basename(result.output_path)}")
        else:
            self.log_message(f"✗ {os.path.basename(result.file_path)}: {result.error}")
        
        # Update UI
        self.root.update_idletasks()
    
    def log_message(self, message: str):
        """Add a message to the results text area"""
        self.results_text.insert(tk.END, message + "\n")
        self.results_text.see(tk.END)
        self.root.update_idletasks()
    
    def clear_results(self):
        """Clear the results text area"""
        self.results_text.delete(1.0, tk.END)
    
    def run(self):
        """Start the GUI"""
        self.root.mainloop()

def print_summary(stage_data: StageData, decoder: StageDecoder):
    """Print a summary of the decoded stage data"""
    print(f"\n=== Stage Data Summary ===")
    print(f"Version: {stage_data.version}")
    print(f"Stage Clip Width: {stage_data.stage_clip_width}")
    print(f"Total Objects: {len(stage_data.objects)}")
    
    # Count objects by type
    type_counts = {}
    for obj in stage_data.objects:
        obj_type_name = decoder.get_type_name(obj.obj_type)
        type_counts[obj_type_name] = type_counts.get(obj_type_name, 0) + 1
    
    print(f"\nObject Types:")
    for obj_type, count in sorted(type_counts.items()):
        print(f"  {obj_type}: {count}")

def main():
    parser = argparse.ArgumentParser(description='Decode/Encode StageLib Unity scene files - Batch Processing Version')
    parser.add_argument('input', nargs='?', help='Input file, folder, or leave empty for GUI')
    parser.add_argument('-o', '--output', help='Output directory for batch processing')
    parser.add_argument('-s', '--summary', action='store_true', help='Print summary only (single file decode mode)')
    parser.add_argument('--compact', action='store_true', help='Export compact JSON (decode mode only)')
    parser.add_argument('--gui', action='store_true', help='Force GUI mode')
    parser.add_argument('--mode', choices=['decode', 'encode'], default='decode',
                       help='Processing mode: decode (StageLib->JSON) or encode (JSON->StageLib)')
    parser.add_argument('--extensions', nargs='+', 
                       help='File extensions to process (default depends on mode)')
    parser.add_argument('--workers', type=int, default=4, help='Number of worker threads for batch processing')
    
    args = parser.parse_args()
    
    # Set default extensions based on mode
    if args.extensions is None:
        if args.mode == 'decode':
            args.extensions = ['.json']
        else:
            args.extensions = ['.json']
    
    # If no input provided or GUI flag is set, start GUI
    if not args.input or args.gui:
        try:
            gui = GUI()
            gui.run()
        except ImportError:
            print("GUI mode requires tkinter. Install it or use command line mode.")
            sys.exit(1)
        return
    
    input_path = args.input
    
    # Check if input is a file or directory
    if os.path.isfile(input_path):
        # Single file mode
        try:
            decoder = StageDecoder()
            
            if args.mode == 'decode':
                print(f"Decoding: {input_path}")
                stage_data = decoder.decode_file(input_path)
                print("✓ Successfully decoded!")
                
                print_summary(stage_data, decoder)
                
                if args.output and not args.summary:
                    output_file = os.path.join(args.output, 
                                             Path(input_path).stem + '.json')
                    os.makedirs(args.output, exist_ok=True)
                    decoder.export_to_json(output_file, pretty=not args.compact)
                elif not args.summary:
                    # Default output filename
                    output_file = str(Path(input_path).with_suffix('')) + '.json'
                    decoder.export_to_json(output_file, pretty=not args.compact)
            
            else:  # encode mode
                print(f"Encoding: {input_path}")
                
                if args.output:
                    output_file = os.path.join(args.output, 
                                             Path(input_path).stem + '.json')
                    os.makedirs(args.output, exist_ok=True)
                else:
                    output_file = str(Path(input_path).with_suffix('')) + '.json'
                
                decoder.encode_to_file(input_path, output_file)
                print(f"✓ Successfully encoded to: {output_file}")
                
        except Exception as e:
            print(f"Error: {e}", file=sys.stderr)
            sys.exit(1)
    
    elif os.path.isdir(input_path):
        # Batch processing mode
        try:
            processor = BatchProcessor(max_workers=args.workers)
            
            # Set up progress callback
            def progress_callback(current, total, result):
                progress = f"[{current}/{total}]"
                if result.success:
                    print(f"{progress} ✓ {os.path.basename(result.file_path)}")
                else:
                    print(f"{progress} ✗ {os.path.basename(result.file_path)}: {result.error}")
            
            processor.set_progress_callback(progress_callback)
            
            print(f"Scanning directory: {input_path}")
            files = processor.find_files(input_path, args.extensions)
            
            if not files:
                print(f"No files with extensions {args.extensions} found in {input_path}")
                sys.exit(1)
            
            print(f"Found {len(files)} files to process")
            print(f"Starting batch {args.mode} processing...")
            
            if args.mode == 'decode':
                results = processor.process_batch_decode(files, args.output, args.compact)
            else:
                results = processor.process_batch_encode(files, args.output)
            
            # Print summary
            successful = sum(1 for r in results if r.success)
            failed = len(results) - successful
            
            print(f"\n=== Batch Processing Complete ===")
            print(f"Successfully processed: {successful}")
            print(f"Failed: {failed}")
            
            if failed > 0:
                print(f"\nFailed files:")
                for result in results:
                    if not result.success:
                        print(f"  - {result.file_path}: {result.error}")
            
            if successful > 0:
                output_location = args.output or "same directory as input files"
                mode_text = "decoded" if args.mode == 'decode' else "encoded"
                print(f"\n{mode_text.capitalize()} files saved to: {output_location}")
                
        except Exception as e:
            print(f"Error during batch processing: {e}", file=sys.stderr)
            sys.exit(1)
    
    else:
        print(f"Error: {input_path} is not a valid file or directory", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()
