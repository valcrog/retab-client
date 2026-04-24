@echo off
title ReTab Launcher
echo Starting ReTab Initialization...
PowerShell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup.ps1"
pause