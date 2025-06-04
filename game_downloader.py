#!/usr/bin/env python3
"""
Game File Downloader CLI
Downloads game assets from CDN based on manifest JSON files.
Supports multiple filters and platform-specific assets.
"""

import argparse
import json
import os
import sys
import hashlib
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from typing import Dict, List, Optional, Set
from urllib.parse import urljoin
import requests
from tqdm import tqdm


class GameFileDownloader:
    def __init__(self, base_cdn_url: str = "https://x-cdn-dolphin.marv-games.jp/prd001/resources"):
        self.base_cdn_url = base_cdn_url.rstrip('/')
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })

    def fetch_manifest(self, manifest_url: str) -> Dict:
        """Fetch and parse the manifest JSON file."""
        try:
            response = self.session.get(manifest_url, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise Exception(f"Failed to fetch manifest: {e}")
        except json.JSONDecodeError as e:
            raise Exception(f"Failed to parse manifest JSON: {e}")

    def verify_file_integrity(self, file_path: Path, expected_sha1: str, expected_size: int) -> bool:
        """Verify file integrity using SHA1 hash and size."""
        if not file_path.exists():
            return False
        
        # Check file size first (faster)
        if file_path.stat().st_size != expected_size:
            return False
        
        # Check SHA1 hash
        sha1_hash = hashlib.sha1()
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(8192), b""):
                sha1_hash.update(chunk)
        
        return sha1_hash.hexdigest() == expected_sha1

    def apply_filters(self, files: List[Dict], filters: List[str], platforms: List[str], 
                     exclude_filters: List[str] = None) -> List[Dict]:
        """Apply multiple filters to file list."""
        if not filters and not platforms and not exclude_filters:
            return files
        
        filtered_files = []
        exclude_filters = exclude_filters or []
        
        for file_info in files:
            file_path = file_info.get('path', '')
            file_name = file_info.get('name', '')
            
            # Check exclusion filters first
            if exclude_filters:
                should_exclude = False
                for exclude_filter in exclude_filters:
                    if self._matches_filter(file_path, file_name, exclude_filter):
                        should_exclude = True
                        break
                if should_exclude:
                    continue
            
            # Check platform filters
            if platforms:
                platform_match = False
                for platform in platforms:
                    if self._matches_platform(file_path, platform):
                        platform_match = True
                        break
                if not platform_match:
                    continue
            
            # Check include filters
            if filters:
                filter_match = False
                for filter_term in filters:
                    if self._matches_filter(file_path, file_name, filter_term):
                        filter_match = True
                        break
                if not filter_match:
                    continue
            
            filtered_files.append(file_info)
        
        return filtered_files

    def _matches_filter(self, file_path: str, file_name: str, filter_term: str) -> bool:
        """Check if a file matches a filter term."""
        filter_lower = filter_term.lower()
        
        # Check if it's a regex pattern (starts and ends with /)
        if filter_term.startswith('/') and filter_term.endswith('/'):
            pattern = filter_term[1:-1]  # Remove the / delimiters
            try:
                return bool(re.search(pattern, file_path, re.IGNORECASE) or 
                           re.search(pattern, file_name, re.IGNORECASE))
            except re.error:
                # If regex is invalid, fall back to string matching
                pass
        
        # Standard string matching
        return (filter_lower in file_path.lower() or 
                filter_lower in file_name.lower() or
                filter_lower in Path(file_name).stem.lower())

    def _matches_platform(self, file_path: str, platform: str) -> bool:
        """Check if a file matches a platform filter."""
        platform_lower = platform.lower()
        file_path_lower = file_path.lower()
        
        platform_mappings = {
            'pc': ['/assets/pc/', '/pc/'],
            'android': ['/assets/android/', '/android/'],
            'ios': ['/assets/ios/', '/ios/'],
            'common': ['/assets/cmn/', '/cmn/', '/common/'],
            'shared': ['/assets/cmn/', '/cmn/', '/common/', '/shared/']
        }
        
        if platform_lower in platform_mappings:
            return any(path_part in file_path_lower for path_part in platform_mappings[platform_lower])
        else:
            # Custom platform path
            return f'/{platform_lower}/' in file_path_lower or f'/assets/{platform_lower}/' in file_path_lower

    def get_available_categories(self, files: List[Dict]) -> Dict[str, Set[str]]:
        """Analyze files to show available categories and platforms."""
        categories = set()
        platforms = set()
        
        for file_info in files:
            file_path = file_info.get('path', '')
            file_name = file_info.get('name', '')
            
            # Extract categories from file names/paths
            path_parts = file_path.split('/')
            name_parts = Path(file_name).stem.split('.')
            
            for part in path_parts + name_parts:
                if part and len(part) > 2:
                    categories.add(part)
            
            # Extract platforms
            file_path_lower = file_path.lower()
            if '/assets/pc/' in file_path_lower or '/pc/' in file_path_lower:
                platforms.add('PC')
            elif '/assets/android/' in file_path_lower or '/android/' in file_path_lower:
                platforms.add('Android')
            elif '/assets/ios/' in file_path_lower or '/ios/' in file_path_lower:
                platforms.add('iOS')
            elif '/assets/cmn/' in file_path_lower or '/cmn/' in file_path_lower:
                platforms.add('Common')
        
        return {
            'categories': categories,
            'platforms': platforms
        }

    def download_file(self, file_info: Dict, output_dir: Path, force: bool = False) -> bool:
        """Download a single file with integrity verification."""
        file_path = file_info['path'].lstrip('/')
        file_name = file_info['name']
        file_size = file_info['size']
        file_sha1 = file_info['sha1']
        
        # Construct full URL
        download_url = f"{self.base_cdn_url}/{file_path}"
        
        # Create output path
        local_path = output_dir / file_path
        local_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Check if file already exists and is valid
        if not force and self.verify_file_integrity(local_path, file_sha1, file_size):
            return True
        
        try:
            response = self.session.get(download_url, stream=True, timeout=60)
            response.raise_for_status()
            
            # Download with progress bar
            with open(local_path, 'wb') as f:
                downloaded = 0
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        downloaded += len(chunk)
            
            # Verify downloaded file
            if self.verify_file_integrity(local_path, file_sha1, file_size):
                return True
            else:
                local_path.unlink(missing_ok=True)
                raise Exception("File integrity verification failed")
                
        except Exception as e:
            local_path.unlink(missing_ok=True)
            raise Exception(f"Download failed: {e}")

    def download_files(self, manifest_data: Dict, output_dir: Path, 
                      max_workers: int = 4, force: bool = False,
                      filters: List[str] = None, platforms: List[str] = None,
                      exclude_filters: List[str] = None, list_only: bool = False) -> None:
        """Download all files from manifest with parallel processing."""
        # Get all available file types (masters, and any other categories)
        resources = manifest_data.get('resources', {})
        all_files = []
        
        # Collect all files from different resource categories
        for category, files in resources.items():
            if isinstance(files, list):
                all_files.extend(files)
        
        if not all_files:
            print("No files found in manifest")
            return
        
        # Apply filters
        filtered_files = self.apply_filters(all_files, filters or [], platforms or [], exclude_filters)
        
        if list_only:
            self._list_files(filtered_files, all_files)
            return
        
        if not filtered_files:
            print("No files match the specified filters")
            available = self.get_available_categories(all_files)
            print(f"\nAvailable platforms: {', '.join(sorted(available['platforms']))}")
            print(f"Common categories: {', '.join(sorted(list(available['categories'])[:20]))}")
            return
        
        print(f"Starting download of {len(filtered_files)} files (filtered from {len(all_files)} total)...")
        print(f"Release: {manifest_data.get('releaseNo', 'Unknown')}")
        print(f"Version: {manifest_data.get('version', 'Unknown')}")
        print(f"Output directory: {output_dir}")
        print(f"Max workers: {max_workers}")
        if filters:
            print(f"Filters: {', '.join(filters)}")
        if platforms:
            print(f"Platforms: {', '.join(platforms)}")
        if exclude_filters:
            print(f"Excluding: {', '.join(exclude_filters)}")
        print("-" * 50)
        
        successful = 0
        failed = 0
        skipped = 0
        
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # Submit all download tasks
            future_to_file = {
                executor.submit(self.download_file, file_info, output_dir, force): file_info
                for file_info in filtered_files
            }
            
            # Process completed downloads with progress bar
            with tqdm(total=len(filtered_files), desc="Downloading", unit="file") as pbar:
                for future in as_completed(future_to_file):
                    file_info = future_to_file[future]
                    file_name = file_info['name']
                    
                    try:
                        result = future.result()
                        if result:
                            successful += 1
                            pbar.set_postfix_str(f"✓ {Path(file_name).name}")
                        else:
                            skipped += 1
                            pbar.set_postfix_str(f"↷ {Path(file_name).name}")
                    except Exception as e:
                        failed += 1
                        pbar.set_postfix_str(f"✗ {Path(file_name).name}")
                        tqdm.write(f"Failed to download {file_name}: {e}")
                    
                    pbar.update(1)
        
        print("\n" + "=" * 50)
        print(f"Download Summary:")
        print(f"  Successful: {successful}")
        print(f"  Failed: {failed}")
        print(f"  Skipped: {skipped}")
        print(f"  Total: {len(filtered_files)}")

    def _list_files(self, filtered_files: List[Dict], all_files: List[Dict]) -> None:
        """List files matching filters."""
        print(f"Found {len(filtered_files)} files matching filters (out of {len(all_files)} total):")
        print("-" * 80)
        
        for file_info in filtered_files:
            file_path = file_info['path']
            file_size = file_info['size']
            size_mb = file_size / (1024 * 1024)
            print(f"{file_path:<60} {size_mb:>8.2f} MB")
        
        total_size = sum(f['size'] for f in filtered_files) / (1024 * 1024)
        print("-" * 80)
        print(f"Total size: {total_size:.2f} MB")


def main():
    parser = argparse.ArgumentParser(
        description="Download game files from CDN using manifest JSON",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Download all files
  %(prog)s https://raw.githubusercontent.com/DerpyMario/VTG-V2/refs/heads/main/25053000-116-0.json
  
  # Download only Master files
  %(prog)s manifest.json --filter Master
  
  # Download Character and AdventureScript files
  %(prog)s manifest.json --filter Character AdventureScript
  
  # Download only PC platform files
  %(prog)s manifest.json --platform pc
  
  # Download Android and PC files with Character filter
  %(prog)s manifest.json --platform android pc --filter Character
  
  # Download all except Master files
  %(prog)s manifest.json --exclude Master
  
  # Use regex filter (files containing numbers)
  %(prog)s manifest.json --filter "/\d+/"
  
  # List files without downloading
  %(prog)s manifest.json --filter Character --list
        """
    )
    
    parser.add_argument(
        'manifest',
        help='URL or local path to manifest JSON file'
    )
    
    parser.add_argument(
        '-o', '--output',
        type=Path,
        default=Path('./downloads'),
        help='Output directory for downloaded files (default: ./downloads)'
    )
    
    parser.add_argument(
        '-w', '--workers',
        type=int,
        default=4,
        help='Number of parallel download workers (default: 4)'
    )
    
    parser.add_argument(
        '--force',
        action='store_true',
        help='Force re-download even if files already exist and are valid'
    )
    
    parser.add_argument(
        '--filter',
        nargs='+',
        help='Filter files by name/path (supports multiple filters and regex with /pattern/)'
    )
    
    parser.add_argument(
        '--platform',
        nargs='+',
        choices=['pc', 'android', 'ios', 'common', 'shared'],
        help='Filter by platform (pc, android, ios, common, shared)'
    )
    
    parser.add_argument(
        '--exclude',
        nargs='+',
        help='Exclude files matching these filters'
    )
    parser.add_argument(
        '--list',
        action='store_true',
        help='List matching files without downloading'
    )
    
    parser.add_argument(
        '--cdn-url',
        default='https://x-cdn-dolphin.marv-games.jp/prd001/resources',
        help='Base CDN URL (default: https://x-cdn-dolphin.marv-games.jp/prd001/resources)'
    )
    
    parser.add_argument(
        '--show-categories',
        action='store_true',
        help='Show available categories and platforms in the manifest'
    )
    
    args = parser.parse_args()
    
    try:
        # Initialize downloader
        downloader = GameFileDownloader(args.cdn_url)
        
        # Load manifest
        if args.manifest.startswith(('http://', 'https://')):
            print(f"Fetching manifest from: {args.manifest}")
            manifest_data = downloader.fetch_manifest(args.manifest)
        else:
            print(f"Loading manifest from: {args.manifest}")
            with open(args.manifest, 'r') as f:
                manifest_data = json.load(f)
        
        # Show categories if requested
        if args.show_categories:
            resources = manifest_data.get('resources', {})
            all_files = []
            for category, files in resources.items():
                if isinstance(files, list):
                    all_files.extend(files)
            
            available = downloader.get_available_categories(all_files)
            print(f"Total files: {len(all_files)}")
            print(f"Available platforms: {', '.join(sorted(available['platforms']))}")
            print(f"Common categories found in file names/paths:")
            categories = sorted(available['categories'])
            for i in range(0, len(categories), 5):
                print(f"  {', '.join(categories[i:i+5])}")
            return
        
        # Create output directory
        if not args.list:
            args.output.mkdir(parents=True, exist_ok=True)
        
        # Start download
        downloader.download_files(
            manifest_data=manifest_data,
            output_dir=args.output,
            max_workers=args.workers,
            force=args.force,
            filters=args.filter,
            platforms=args.platform,
            exclude_filters=args.exclude,
            list_only=args.list
        )
        
    except KeyboardInterrupt:
        print("\nDownload interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


if __name__ == '__main__':
    main()
