param (
    [string]$action,
    [string]$deviceId,
    [string]$outputPath
)

if ($action -eq "list") {
    $devices = @()
    
    # 1. Tentar ler do WIA (Scanners oficiais registrados)
    try {
        $deviceManager = New-Object -ComObject WIA.DeviceManager
        foreach ($info in $deviceManager.DeviceInfos) {
            if ($info.Type -eq 1) { # 1 = Scanner
                $devices += [PSCustomObject]@{
                    id = $info.DeviceID
                    nome = $info.Properties.Item("Name").Value
                    descricao = $info.Properties.Item("Description").Value
                    conexao = $info.Properties.Item("Port").Value
                    real = $true
                    pnp = $false
                }
            }
        }
    } catch {
        # Ignora erros do WIA para continuar a verificação de hardware PnP
    }

    # 2. Ler do barramento de hardware WMI (Scanners e Impressoras conectados)
    try {
        $pnpDevices = Get-WmiObject -Class Win32_PnPEntity | Where-Object { 
            $_.Name -like "*scan*" -or $_.Name -like "*epson*" -or $_.Name -like "*canon*" -or $_.Name -like "*hp*" -or $_.PNPClass -eq "Printer" -or $_.PNPClass -eq "PrintQueue"
        }
        
        foreach ($pnp in $pnpDevices) {
            if ($pnp.Name -and 
                $pnp.Name -notlike "*Microsoft*" -and 
                $pnp.Name -notlike "*Root*" -and 
                $pnp.Name -notlike "*PDF*" -and 
                $pnp.Name -notlike "*Utility*" -and 
                $pnp.Name -notlike "*XPS*" -and 
                $pnp.Name -notlike "*OneNote*" -and 
                $pnp.Name -notlike "*Fax*" -and 
                $pnp.Name -notlike "*Fila*") {
                
                $alreadyExists = $false
                foreach ($d in $devices) {
                    if ($d.nome -eq $pnp.Name) { $alreadyExists = $true }
                }
                if (-not $alreadyExists) {
                    $hasError = $pnp.ConfigManagerErrorCode -ne 0
                    $desc = if ($hasError) { "Dispositivo Físico (Driver de Scanner ausente - Erro 28)" } else { "Dispositivo Físico Ativo no Sistema (Pronto)" }
                    $devices += [PSCustomObject]@{
                        id = "PNP_" + $pnp.DeviceID.Replace('\', '_').Replace('&', '_').Replace(';', '_')
                        nome = $pnp.Name
                        descricao = $desc
                        conexao = "USB / Rede (PnP)"
                        real = $true
                        pnp = $true
                    }
                }
            }
        }
    } catch {
        # Silencia erros de PNP
    }

    # 3. Adicionar simuladores virtuais se nenhum dispositivo real foi encontrado
    if ($devices.Count -eq 0) {
        $devices += [PSCustomObject]@{
            id = "VIRTUAL_SCAN_01"
            nome = "Scanner Corporativo eSCL HP/Epson (Rede)"
            descricao = "Multifuncional de alta velocidade eSCL no IP 192.168.0.150"
            conexao = "IP: 192.168.0.150"
            real = $false
            pnp = $false
        }
        $devices += [PSCustomObject]@{
            id = "VIRTUAL_SCAN_02"
            nome = "Scanner de Mesa WIA Canon LiDE (USB)"
            descricao = "Scanner USB de alta fidelidade WIA"
            conexao = "USB: Port_#0001"
            real = $false
            pnp = $false
        }
    }

    $devices | ConvertTo-Json
}
elseif ($action -eq "scan") {
    try {
        $deviceManager = New-Object -ComObject WIA.DeviceManager
        $wiaScannersCount = 0
        foreach ($info in $deviceManager.DeviceInfos) {
            if ($info.Type -eq 1) { $wiaScannersCount++ }
        }

        # Se houver escâneres WIA e não for os simuladores virtuais de teste, tenta digitalizar no hardware real
        if ($wiaScannersCount -gt 0 -and $deviceId -notlike "VIRTUAL_*") {
            $wiaDialog = New-Object -ComObject WIA.CommonDialog
            $image = $wiaDialog.ShowAcquireImage()
            if ($image -ne $null) {
                if (Test-Path $outputPath) {
                    Remove-Item $outputPath -Force
                }
                $image.SaveFile($outputPath)
                Write-Output "SUCCESS"
            } else {
                Write-Output "CANCELLED"
            }
            exit
        } else {
            # Se for virtual ou não houver driver carregado, gera documento simulado
            Write-Output "VIRTUAL"
            exit
        }
    } catch {
        # Fallback de segurança para não travar a API
        Write-Output "VIRTUAL"
    }
}
